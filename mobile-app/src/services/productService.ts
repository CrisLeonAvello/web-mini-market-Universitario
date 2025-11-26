import { apiRequest } from './api';
import { ENDPOINTS } from '../constants/config';

export const getAllProducts = async (params?: any) => {
  const queryParams = new URLSearchParams(params).toString();
  return await apiRequest(`${ENDPOINTS.PRODUCTS}${queryParams ? '?' + queryParams : ''}`);
};

export const getProductById = async (id: number) => {
  return await apiRequest(`${ENDPOINTS.PRODUCTS}/${id}`);
};

export const getMyProducts = async () => {
  return await apiRequest(ENDPOINTS.MY_PRODUCTS);
};

export const createProduct = async (productData: any) => {
  const formData = new URLSearchParams();
  Object.keys(productData).forEach(key => {
    if (productData[key]) formData.append(key, productData[key]);
  });

  return await apiRequest(ENDPOINTS.PRODUCTS + '/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });
};

export const updateProduct = async (id: number, productData: any) => {
  const formData = new URLSearchParams();
  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined) formData.append(key, productData[key]);
  });

  return await apiRequest(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });
};

export const deleteProduct = async (id: number) => {
  return await apiRequest(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'DELETE',
  });
};

export const toggleProductStatus = async (id: number) => {
  return await apiRequest(`${ENDPOINTS.PRODUCTS}/${id}/pausar`, {
    method: 'PATCH',
  });
};

// Export como objeto para mantener consistencia
export const productService = {
  getAllProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
};
