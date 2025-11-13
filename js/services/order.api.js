import { apiBaseUrl, api_path, token } from '../config/api.config.js';

// 送出購買訂單
async function createOrder(data) {
  const requestBody = {
    data: {
      user: data
    }
  };
  try {
    const response = await axios.post(`${apiBaseUrl}/customer/${api_path}/orders`,requestBody);
    return response;
  } catch (error) {
    throw error;
  }
}

// 取得訂單列表
function getOrderList() {
  axios.get(`${apiBaseUrl}/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 修改訂單狀態
function editOrderList(orderId) {
  axios.put(`${apiBaseUrl}/admin/${api_path}/orders`,
    {
      data: {
        id: orderId,
        paid: true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`${apiBaseUrl}/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`${apiBaseUrl}/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

export { createOrder, getOrderList, editOrderList, deleteAllOrder, deleteOrderItem };

