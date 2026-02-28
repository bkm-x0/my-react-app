import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect on login, register, or checkout pages - let the component handle the error
      const noRedirectPaths = ['/login', '/register', '/checkout'];
      const shouldRedirect = !noRedirectPaths.some(p => currentPath.startsWith(p));
      
      console.error('[API] 401 Unauthorized:', error.response?.data?.message || 'Token expired', 'Path:', currentPath);
      
      if (shouldRedirect) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getFeatured: () => api.get('/products/featured'),
  getReviews: (productId, params) => api.get(`/products/${productId}/reviews`, { params }),
  addReview: (productId, review) => api.post(`/products/${productId}/reviews`, review)
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  confirmOrder: (id, adminNotes) => api.put(`/orders/${id}/confirm`, { adminNotes }),
  rejectOrder: (id, reason) => api.put(`/orders/${id}/reject`, { reason })
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData)
};

export default api;