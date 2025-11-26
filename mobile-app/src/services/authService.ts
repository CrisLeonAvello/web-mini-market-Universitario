import { apiRequest } from './api';
import { ENDPOINTS } from '../constants/config';
import { saveToken, saveUser, removeToken, removeUser } from './storageService';

export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiRequest(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });

  if (response.access_token) {
    await saveToken(response.access_token);
    const user = await getMe();
    await saveUser(user);
    return { token: response.access_token, user };
  }

  throw new Error('Login failed');
};

export const register = async (nombre: string, email: string, password: string) => {
  return await apiRequest(ENDPOINTS.REGISTER, {
    method: 'POST',
    data: { nombre, email, password },
  });
};

export const getMe = async () => {
  return await apiRequest(ENDPOINTS.ME, {
    method: 'GET',
  });
};

export const logout = async () => {
  await removeToken();
  await removeUser();
};
