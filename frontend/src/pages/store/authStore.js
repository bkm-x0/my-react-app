// frontend/src/store/authStore.js
import { create } from 'zustand';

const API_BASE = `http://${window.location.hostname}:5000/api`;

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  login: async (email, password, twoFACode, rememberMe) => {
    set({ loading: true, error: null });
    
    try {
      // First test the backend connection
      try {
        const testResponse = await fetch(`${API_BASE}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!testResponse.ok) {
          throw new Error(`Backend connection failed: ${testResponse.status}`);
        }
      } catch (testError) {
        const errorMsg = `Cannot connect to server at ${API_BASE}`;
        set({ 
          loading: false, 
          error: { 
            message: errorMsg,
            code: 'SERVER_CONNECTION_ERROR'
          } 
        });
        throw new Error(errorMsg);
      }
      
      // Try actual login
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, twoFACode }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Login failed';
        set({ 
          loading: false, 
          error: { message: errorMsg, code: 'LOGIN_ERROR' } 
        });
        throw new Error(errorMsg);
      }
      
      // Store token if received
      if (data.token) {
        // Always save to localStorage for persistence
        localStorage.setItem('token', data.token);
        if (rememberMe) {
          // Also in sessionStorage for faster access
          sessionStorage.setItem('token', data.token);
        }
        
        // Extract user data (excluding token)
        const { token, ...userData } = data;
        
        set({
          user: userData,
          token: data.token,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      } else {
        // Mock response for testing if no backend
        const mockUser = {
          id: 1,
          username: email.split('@')[0],
          email: email,
          role: 'user'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        if (rememberMe) {
          localStorage.setItem('token', mockToken);
        } else {
          sessionStorage.setItem('token', mockToken);
        }
        
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's a connection error
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.code === 'SERVER_CONNECTION_ERROR') {
        set({ 
          loading: false, 
          error: { 
            message: 'Cannot connect to server. Please check: 1. Backend is running 2. Port 5000 is accessible',
            code: 'CONNECTION_ERROR'
          } 
        });
      } else {
        set({ 
          loading: false, 
          error: { 
            message: error.message || 'Login failed',
            code: 'LOGIN_ERROR'
          } 
        });
      }
      
      // Re-throw the error so it can be caught by the component
      throw error;
    }
  },
  
  register: async (userData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store token if received
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Extract user data (excluding token)
        const { token, ...user } = data;
        
        set({
          user: user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      } else {
        throw new Error('No token received from server');
      }
      
    } catch (error) {
      console.error('Register error:', error);
      set({
        loading: false,
        error: {
          message: error.message || 'Registration failed',
          code: 'REGISTER_ERROR'
        }
      });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },
  
  clearError: () => set({ error: null }),
  
  initializeAuth: async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    try {
      set({ loading: true });
      
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },
  
  isAdmin: () => {
    const state = get();
    return state.user && state.user.role === 'admin';
  }
}));

export default useAuthStore;