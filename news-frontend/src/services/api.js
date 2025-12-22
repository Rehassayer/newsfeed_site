// src/services/api.js
// This file handles all communication with your backend

import axios from 'axios';

// Base URL of your backend
const API_URL = 'http://localhost:8003';

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important! Sends cookies with requests
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};

// ==================== ARTICLE SERVICES ====================

export const articleService = {
  // Get all articles with filters
  getAll: async (params = {}) => {
    const response = await api.get('/article', { params });
    return response.data;
  },

  // Get single article by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/article/${slug}`);
    return response.data;
  },

  // Create new article
  create: async (articleData) => {
    const response = await api.post('/article', articleData);
    return response.data;
  },

  // Update article
  update: async (id, articleData) => {
    const response = await api.put(`/article/${id}`, articleData);
    return response.data;
  },

  // Delete article
  delete: async (id) => {
    const response = await api.delete(`/article/${id}`);
    return response.data;
  },

  // Like article
  like: async (id) => {
    const response = await api.post(`/article/${id}/like`);
    return response.data;
  },

  // Get my articles (for authors)
  getMyArticles: async (params = {}) => {
    const response = await api.get('/article/my/articles', { params });
    return response.data;
  },
};

// ==================== CATEGORY SERVICES ====================

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/category');
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug, params = {}) => {
    const response = await api.get(`/category/${slug}`, { params });
    return response.data;
  },

  // Create category (EDITOR/ADMIN only)
  create: async (categoryData) => {
    const response = await api.post('/category', categoryData);
    return response.data;
  },

  // Update category (EDITOR/ADMIN only)
  update: async (id, categoryData) => {
    const response = await api.put(`/category/${id}`, categoryData);
    return response.data;
  },

  // Delete category (ADMIN only)
  delete: async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },
};

// ==================== TAG SERVICES ====================

export const tagService = {
  // Get all tags
  getAll: async () => {
    const response = await api.get('/tag');
    return response.data;
  },

  // Get tag by slug
  getBySlug: async (slug, params = {}) => {
    const response = await api.get(`/tag/${slug}`, { params });
    return response.data;
  },

  // Create tag
  create: async (tagData) => {
    const response = await api.post('/tag', tagData);
    return response.data;
  },

  // Update tag
  update: async (id, tagData) => {
    const response = await api.put(`/tag/${id}`, tagData);
    return response.data;
  },

  // Delete tag
  delete: async (id) => {
    const response = await api.delete(`/tag/${id}`);
    return response.data;
  },
};

// ==================== COMMENT SERVICES ====================

export const commentService = {
  // Get comments for an article
  getArticleComments: async (articleId) => {
    const response = await api.get(`/comment/article/${articleId}`);
    return response.data;
  },

  // Create comment
  create: async (commentData) => {
    const response = await api.post('/comment', commentData);
    return response.data;
  },

  // Update comment
  update: async (id, commentData) => {
    const response = await api.put(`/comment/${id}`, commentData);
    return response.data;
  },

  // Delete comment
  delete: async (id) => {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
  },

  // Get pending comments (EDITOR/ADMIN)
  getPending: async () => {
    const response = await api.get('/comment/pending');
    return response.data;
  },

  // Approve comment (EDITOR/ADMIN)
  approve: async (id) => {
    const response = await api.patch(`/comment/${id}/approve`);
    return response.data;
  },

  // Mark as spam (EDITOR/ADMIN)
  markAsSpam: async (id) => {
    const response = await api.patch(`/comment/${id}/spam`);
    return response.data;
  },
};

// ==================== USER SERVICES ====================

export const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/user/me/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/me/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/user/me/password', passwordData);
    return response.data;
  },

  // Get user by ID (public profile)
  getById: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Get all users (ADMIN only)
  getAll: async (params = {}) => {
    const response = await api.get('/user', { params });
    return response.data;
  },

  // Update user role (ADMIN only)
  updateRole: async (id, role) => {
    const response = await api.patch(`/user/${id}/role`, { role });
    return response.data;
  },

  // Toggle user status (ADMIN only)
  toggleStatus: async (id) => {
    const response = await api.patch(`/user/${id}/status`);
    return response.data;
  },

  // Delete user (ADMIN only)
  delete: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};

// Export the api instance for custom requests
export default api;