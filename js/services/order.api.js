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

const adminApiBaseUrl = `${apiBaseUrl}/admin/${api_path}`;
const adminHeaders = {
  headers: {
    'Authorization': token
  }
}

// 取得訂單列表
async function getOrderList() {
  try {
    const response = await axios.get(`${adminApiBaseUrl}/orders`, adminHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 修改訂單狀態
async function editOrderList(orderId) {
  try {
    const response = await axios.put(`${adminApiBaseUrl}/orders`, {
      data: {
        id: orderId,
        paid: true
      }
    }, adminHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 刪除全部訂單
async function deleteAllOrder() {
  try {
    const response = await axios.delete(`${adminApiBaseUrl}/orders`, adminHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 刪除特定訂單
async function deleteOrderItem(orderId) {
  try {
    const response = await axios.delete(`${adminApiBaseUrl}/orders/${orderId}`, adminHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { createOrder, getOrderList, editOrderList, deleteAllOrder, deleteOrderItem };

