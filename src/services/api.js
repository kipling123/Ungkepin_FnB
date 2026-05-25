// API client for frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return response.json();
  }

  // Auth endpoints
  async login(phone, fullName) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, fullName }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async verifyToken(token) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders', {
      method: 'GET',
    });
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: 'GET',
    });
  }

  // Payment endpoints
  async verifyPayment(orderId, transactionId) {
    return this.request(`/payments/${orderId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  }

  async checkPaymentStatus(orderId) {
    return this.request(`/payments/${orderId}/status`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
