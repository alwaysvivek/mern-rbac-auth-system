import api from './axios';

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
export const refreshToken = (token) => api.post('/auth/refresh-token', { refreshToken: token });
export const logoutUser = (token) => api.post('/auth/logout', { refreshToken: token });
export const getMe = () => api.get('/auth/me');
