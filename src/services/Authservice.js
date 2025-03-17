import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        this._setAuthorizationHeader(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Call the backend logout endpoint if needed
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and remove auth header
      localStorage.removeItem('user');
      this._removeAuthorizationHeader();
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Get current user from local storage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  // Set up interceptor to handle token expiration
  setupAxiosInterceptors() {
    // Request interceptor to add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const user = this.getCurrentUser();
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle authentication errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid, logout user
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to set authorization header
  _setAuthorizationHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Helper method to remove authorization header
  _removeAuthorizationHeader() {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Helper method to handle API errors
  _handleError(error) {
    const errorMessage = 
      (error.response && error.response.data && error.response.data.message) || 
      error.message || 
      'Unknown error occurred';
    
    console.error('API Error:', errorMessage);
  }

  // Initialize auth service
  initialize() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      this._setAuthorizationHeader(user.token);
    }
    this.setupAxiosInterceptors();
  }
}

// Create a singleton instance
const authService = new AuthService();
authService.initialize();

export default authService;
