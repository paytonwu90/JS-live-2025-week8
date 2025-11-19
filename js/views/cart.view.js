import { getCartList, addCartItem, deleteAllCartList, deleteCartItem } from "../services/cart.api.js";
import { formatCurrency } from "../utils/helpers.js";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../utils/alerts.js";

let cartData = [];
let cartTable = null;
let cartTableHead = null;
let cartTableBody = null;
let cartTableFooter = null;
let cartTotalPrice = null;

function initCartView(_cartTable, _cartTableHead, _cartTableBody, _cartTableFooter, _cartTotalPrice) {
  cartTable = _cartTable;
  cartTableHead = _cartTableHead;
  cartTableBody = _cartTableBody;
  cartTableFooter = _cartTableFooter;
  cartTotalPrice = _cartTotalPrice;
  getAndRenderCartList();
  initCartEventListeners();
}

// 取得購物車列表
async function getAndRenderCartList() {
  try {
    const data = await getCartList();
    updateCartState(data);
    renderCartTable(data);
  } catch (error) {
    const message = error.response?.data?.message;
    showErrorAlert("取得購物車列表失敗，請重新嘗試", message);
  }
}

// 渲染購物車列表
function renderCartTable(data) {
  const { carts, finalTotal } = data;

  if (carts.length === 0) {
    cartTableHead.style.display = 'none';
    cartTableFooter.style.display = 'none';
    cartTableBody.innerHTML = `
      <tr style="border: none;">
        <td colspan="5">您的購物車目前空空如也 (๑•́ ₃ •̀๑)</td>
      </tr>
    `;
    return;
  }

  cartTableHead.style.display = '';
  cartTableFooter.style.display = '';

  cartTableBody.innerHTML = carts.map(cartItem => {
    const { product } = cartItem;
    return `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${product.images}" alt="${product.title}">
          <p>${product.title}</p>
        </div>
      </td>
      <td>${formatCurrency(product.price)}</td>
      <td>
        <div class="cartItem-quantity d-flex align-items-center">
          <a href="#" class="cartItem-quantity-minus material-icons-outlined" data-id="${cartItem.id}">
            remove_circle_outline
          </a>
          <span>${cartItem.quantity}</span>
          <a href="#" class="cartItem-quantity-plus material-icons-outlined" data-id="${cartItem.id}">
            add_circle_outline
          </a>
        </div>
      </td>
      <td>${formatCurrency(product.price * cartItem.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${cartItem.id}">
          clear
        </a>
      </td>
    </tr>
    `;
  }).join('');

  cartTotalPrice.textContent = formatCurrency(finalTotal);
}

async function addCartItemAndRender(productId) {
  try {
    // 先確定購物車內是否有同樣商品，有的話把數量加上去
    const cartItem = cartData.carts.find(item => item.product.id === productId);
    const quantity = cartItem ? cartItem.quantity + 1 : 1;
    const data = await addCartItem(productId, quantity);
    updateCartState(data);
    renderCartTable(data);
    showSuccessAlert("已加入購物車");
  } catch (error) {
    const message = error.response?.data?.message;
    showErrorAlert("加入購物車失敗，請重新嘗試", message);
  }
}

function updateCartState(data) {
  cartData = data;
  const event = new CustomEvent('cart:stateChange', { 
    detail: { 
      isEmpty: !data?.carts?.length 
    } 
  });
  document.dispatchEvent(event);
}

function initCartEventListeners() {
  async function handleDeleteCartItem(e) {
    const { target } = e;
    if (!target.matches('.discardBtn > a')) return;
    e.preventDefault();
    const cartId = target.dataset.id;
    try {
      const data = await deleteCartItem(cartId);
      updateCartState(data);
      renderCartTable(data);
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("刪除購物車失敗，請重新嘗試", message);
    }
  }

  async function handleDeleteAllCartList(e) {
    const { target } = e;
    if (!target.matches('.discardAllBtn')) return;
    e.preventDefault();

    try {
      const result = await showConfirmAlert("確定要刪除所有品項嗎？");
      if (result.isConfirmed) {
        const data = await deleteAllCartList();
        updateCartState(data);
        renderCartTable(data);
        showSuccessAlert("已刪除所有品項");
      }
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("刪除所有品項失敗，請重新嘗試", message);
    }
  }

  async function handleQuantityChange(e) {
    const { target } = e;
    const isMinus = target.classList.contains('cartItem-quantity-minus');
    const isPlus = target.classList.contains('cartItem-quantity-plus');
    if (!isMinus && !isPlus) return;
    e.preventDefault();
    const cartId = target.dataset.id;
    const cartItem = cartData.carts.find(item => item.id === cartId);
    try {
      const newQuantity = isMinus ? cartItem.quantity - 1 : cartItem.quantity + 1;
      if (newQuantity < 1) return;
      const data = await addCartItem(cartItem.product.id, newQuantity);
      updateCartState(data);
      renderCartTable(data);
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("更新購物車失敗，請重新嘗試", message);
    }
  }

  cartTable.addEventListener('click', handleDeleteCartItem);
  cartTable.addEventListener('click', handleDeleteAllCartList);
  cartTable.addEventListener('click', handleQuantityChange);
}


export { initCartView, addCartItemAndRender, getAndRenderCartList };
