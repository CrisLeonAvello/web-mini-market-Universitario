import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { getToken } from './storageService';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // No sobrescribir el Content-Type si ya está definido
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const apiRequest = async (endpoint: string, options: any = {}) => {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export default api;
