import { apiBaseUrl, api_path } from '../config/api.config.js';

// 取得產品列表
export async function getProducts() {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/customer/${api_path}/products`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
