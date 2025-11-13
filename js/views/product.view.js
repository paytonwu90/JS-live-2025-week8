
import { formatCurrency } from "../utils/helpers.js";
import { getProducts } from "../services/product.api.js";
import { addCartItemAndRender } from "./cart.view.js";
import { showErrorAlert } from "../utils/alerts.js";

let allProducts = [];
let productSelect = null;
let productWrap = null;

function initProductView(_productWrap, _productSelect) {
  productSelect = _productSelect;
  productWrap = _productWrap;
  
  getAndRenderProductList();
  initProductEventListeners();
}

// 取得產品列表
async function getAndRenderProductList() {
  try {
    const data = await getProducts();
    allProducts = data.products;
    renderProductList(data);
  } catch (error) {
    const message = error.response?.data?.message;
    showErrorAlert("取得產品列表失敗，請重新嘗試", message);
  }
}

function renderProductList(data) {
  const { products } = data;
  productWrap.innerHTML = products.map(product => {
    return `
      <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${product.images}" alt="${product.title}">
        <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
        <h3>${product.title}</h3>
        <del class="originPrice">${formatCurrency(product.origin_price)}</del>
        <p class="nowPrice">${formatCurrency(product.price)}</p>
      </li>
    `;
  }).join('');
}

function initProductEventListeners() {
  function handleAddToCart(e) {
    const { target } = e;
    if (!target.matches('.addCardBtn')) return;
    e.preventDefault();

    const productId = target.dataset.id;
    addCartItemAndRender(productId);
  }

  function handleFilterProducts() {
    const selectedType = productSelect.value;
    const filteredProducts = selectedType === '全部'
      ? allProducts
      : allProducts.filter(product => product.category === selectedType);
    renderProductList({ products: filteredProducts });
  }

  productWrap.addEventListener('click', handleAddToCart);
  productSelect.addEventListener('change', handleFilterProducts);
}


export { initProductView };
