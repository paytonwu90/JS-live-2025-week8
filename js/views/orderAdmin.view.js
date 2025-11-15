import { getOrderList, editOrderList, deleteOrderItem, deleteAllOrder } from "../services/order.api.js";
import { formatDate } from "../utils/helpers.js";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../utils/alerts.js";

let orderData = [];
let orderTable = null;
let orderTableBody = null;
let discardAllBtn = null;


function initOrderAdminView() {
  orderTable = document.querySelector('.orderPage-table');
  orderTableBody = orderTable.querySelector('tbody');
  discardAllBtn = document.querySelector('.discardAllBtn');
  getAndRenderOrderList();
  initOrderAdminEventListeners();
}


async function getAndRenderOrderList() {
  try {
    const data = await getOrderList();
    updateOrderState(data);
    renderOrderTable(data);
    renderChart(data);
  } catch (error) {
    const message = error.response?.data?.message;
    showErrorAlert("取得訂單列表失敗，請重新嘗試", message);
  }
}

function renderOrderTable(data) {
  const { orders } = data;
  if (orders.length === 0) {
    orderTableBody.innerHTML = `
      <tr style="">
        <td colspan="8">目前沒有訂單</td>
      </tr>
    `;
    return;
  }

  orderTableBody.innerHTML = orders.map(order => {
    const { id, user, products, createdAt, paid } = order;
    return `
      <tr>
        <td>${id}</td>
        <td>
          <p>${user.name}</p>
          <p>${user.tel}</p>
        </td>
        <td>${user.address}</td>
        <td>${user.email}</td>
        <td>
          <p>${products.map(product => product.title).join('<br/>')}</p>
        </td>
        <td>${formatDate(createdAt)}</td>
        <td class="orderStatus">
          ${paid ? '<span class="orderStatus-done">已處理</span>' : '<a href="#" class="orderStatus-unDone">未處理</a>'}
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
      </tr>
    `;
  }).join('');
}

function renderChart(data) {
  /* 
  LV 2｜（圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾）
  LV 3｜（圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」）
  */
  const { orders } = data;

  if (orders.length === 0) {
    document.querySelector("#chart").innerHTML = "<p class='text-center'>目前沒有訂單</p>";
    return;
  }

  const categoryRevenue = orders.reduce((acc, order) => {
    const { products } = order;
    products.forEach(product => {
      const { category, price } = product;
      acc[category] = (acc[category] || 0) + price;
    });
    return acc;
  }, {});

  const chartData = Object.entries(categoryRevenue).map(([category, revenue]) => [category, revenue]);

  const chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartData,
    },
    color: {
      pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F'],
    }
  });

}

function updateOrderState(data) {
  orderData = data;
  const event = new CustomEvent('order:stateChange', { 
    detail: { 
      isEmpty: !data?.orders?.length 
    } 
  });
  discardAllBtn.dispatchEvent(event);
}

function initOrderAdminEventListeners() {
  async function handleOrderStatusChange(e) {
    const { target } = e;
    if(!target.classList.contains('orderStatus-unDone')) return;
    e.preventDefault();

    const orderId = target.closest('tr').querySelector('td:first-child').textContent;
    try {
      const data = await editOrderList(orderId);
      updateOrderState(data);
      renderOrderTable(data);
      renderChart(data);
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("修改訂單狀態失敗，請重新嘗試", message);
    }
  }

  async function handleDeleteSingleOrder(e) {
    const { target } = e;
    if(!target.classList.contains('delSingleOrder-Btn')) return;
    e.preventDefault();

    const orderId = target.closest('tr').querySelector('td:first-child').textContent;
    try {
      const data = await deleteOrderItem(orderId);
      updateOrderState(data);
      renderOrderTable(data);
      renderChart(data);
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("刪除訂單失敗，請重新嘗試", message);
    }
  }

  async function handleDeleteAllOrder(e) {
    const { target } = e;
    if(!target.classList.contains('discardAllBtn')) return;
    e.preventDefault();

    try {
      const result = await showConfirmAlert("確定要刪除所有訂單嗎？");
      if (result.isConfirmed) {
        const data = await deleteAllOrder();
        updateOrderState(data);
        renderOrderTable(data);
        renderChart(data);
        showSuccessAlert("已刪除所有訂單");
      }
    } catch (error) {
      const message = error.response?.data?.message;
      showErrorAlert("刪除所有訂單失敗，請重新嘗試", message);
    }
  }


  orderTableBody.addEventListener('click', handleOrderStatusChange);
  orderTableBody.addEventListener('click', handleDeleteSingleOrder);
  discardAllBtn.addEventListener('click', handleDeleteAllOrder);
  discardAllBtn.addEventListener('order:stateChange', e => {
    const { isEmpty } = e.detail;
    if (isEmpty) {
      discardAllBtn.classList.add('disabled');
    } else {
      discardAllBtn.classList.remove('disabled');
    }
  });
}


export { initOrderAdminView };
