import { apiBaseUrl, api_path } from '../config/api.config.js';

const cartApiBaseUrl = `${apiBaseUrl}/customer/${api_path}/carts`;

// 取得購物車列表
async function getCartList() {
  try {
    const response = await axios.get(cartApiBaseUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 加入購物車
async function addCartItem(productId, quantity = 1) {
  try {
    const response = await axios.post(cartApiBaseUrl, {
      data: { productId, quantity }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 清除購物車內全部產品
async function deleteAllCartList() {
  try {
    const response = await axios.delete(cartApiBaseUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 刪除購物車內特定產品
async function deleteCartItem(cartId) {
  try {
    const response = await axios.delete(`${cartApiBaseUrl}/${cartId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { getCartList, addCartItem, deleteAllCartList, deleteCartItem };
