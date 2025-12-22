// src/context/AuthContext.jsx
// This manages the logged-in user across your entire app

import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Get user profile
        const response = await userService.getProfile();
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authService.register({ name, email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Check if user can edit content (AUTHOR, EDITOR, ADMIN)
  const canEdit = () => {
    return hasRole(['AUTHOR', 'EDITOR', 'ADMIN']);
  };

  // Check if user can moderate (EDITOR, ADMIN)
  const canModerate = () => {
    return hasRole(['EDITOR', 'ADMIN']);
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    canEdit,
    canModerate,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;