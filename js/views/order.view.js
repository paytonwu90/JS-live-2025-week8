import { getCartList } from "../services/cart.api.js";
import { createOrder } from "../services/order.api.js";
import { getAndRenderCartList } from "./cart.view.js";
import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";


let orderForm = null;
let submitBtn = null;

function initOrderView(_orderForm) {
  orderForm = _orderForm;
  submitBtn = orderForm.querySelector('.orderInfo-btn');
  initOrderEventListeners();
}

function initOrderEventListeners() {
  function validateForm() {
    const requiredFields = orderForm.querySelectorAll('.orderInfo-input');
    let isValid = true;
    requiredFields.forEach(field => {
      const messageElement = field.nextElementSibling;
      if (!field.value.trim()) {
        isValid = false;
        messageElement && (messageElement.style.display = 'block');
      } else {
        messageElement && (messageElement.style.display = '');
      }
    });
    return isValid;
  }

  async function handleCreateOrder(e) {
    e.preventDefault();
    if (!validateForm()) {
      showErrorAlert("請填寫必填欄位");
      return;
    }
    try {
      const cartList = await getCartList();
      if (cartList.carts.length === 0) {
        showErrorAlert("購物車目前空空如也 (๑•́ ₃ •̀๑)");
        return;
      }
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("取得購物車列表失敗，請重新嘗試", message);
      return;
    }

    const formData = new FormData(orderForm);
    const orderData = {
      name: formData.get('name').trim(),
      tel: formData.get('tel').trim(),
      email: formData.get('email').trim(),
      address: formData.get('address').trim(),
      payment: formData.get('payment').trim()
    };
    
    try {
      const response = await createOrder(orderData);
      showSuccessAlert("訂單建立成功");
      orderForm.reset();

      // 送出訂單後後端會清空購物車，因此重新 get and render
      getAndRenderCartList();
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("訂單建立失敗，請重新嘗試", message);
      return;
    }
  }

  function updateSubmitButtonState(isCartEmpty) {
    submitBtn.disabled = isCartEmpty;
  }

  orderForm.addEventListener('submit', handleCreateOrder);
  document.addEventListener('cart:stateChange', (e) => {
    updateSubmitButtonState(e.detail.isEmpty);
  });
}



export { initOrderView };
