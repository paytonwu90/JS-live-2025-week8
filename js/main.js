import { initProductView } from "./views/product.view.js";
import { initCartView } from "./views/cart.view.js";
import { initOrderView } from "./views/order.view.js";

// DOM 節點快取
const domRefs = {
  // 產品相關
  productSelect: null,
  productWrap: null,
  // 購物車相關
  cartTable: null,
  cartTableHead: null,
  cartTableBody: null,
  cartTableFooter: null,
  cartTotalPrice: null,
  // 表單相關
  orderForm: null
};

function initDomRefs() {
  domRefs.productSelect = document.querySelector('.productSelect');
  domRefs.productWrap = document.querySelector('.productWrap');
  domRefs.cartTable = document.querySelector('.shoppingCart-table');
  domRefs.cartTableHead = document.querySelector('.shoppingCart-table thead');
  domRefs.cartTableBody = document.querySelector('.shoppingCart-table tbody');
  domRefs.cartTableFooter = document.querySelector('.shoppingCart-table tfoot');
  domRefs.cartTotalPrice = document.querySelector('.shoppingCart-table .totalPrice');
  domRefs.orderForm = document.querySelector('.orderInfo-form');
}

function initApp() {
  initDomRefs();

  initProductView(domRefs.productWrap, domRefs.productSelect);
  initCartView(domRefs.cartTable, domRefs.cartTableHead, domRefs.cartTableBody, domRefs.cartTableFooter, domRefs.cartTotalPrice);
  initOrderView(domRefs.orderForm);
}

document.addEventListener('DOMContentLoaded', initApp);

