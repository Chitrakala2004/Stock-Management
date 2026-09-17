import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerService = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const productService = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  adjustStock: (id, casesChange) => api.put(`/products/${id}/stock`, { casesChange }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const brandService = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', typeof data === 'string' ? { name: data } : data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

export const purchaseService = {
  getAll: () => api.get('/purchases'),
  create: (data) => api.post('/purchases', data),
  delete: (id) => api.delete(`/purchases/${id}`),
};

export const advanceService = {
  getAll: () => api.get('/advances'),
  create: (data) => api.post('/advances', data),
  delete: (id) => api.delete(`/advances/${id}`),
};

export const transactionService = {
  getAll: () => api.get('/transactions'),
  create: (data) => api.post('/transactions', data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export default api;
