import { createContext, useContext, useState, useEffect } from "react";
import { authService, userService } from "../services/api";

// Create the context
export const AuthContext = createContext(null);

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
      setLoading(true);

      // Attempt to get the profile.
      // Because 'api.js' has 'withCredentials: true',
      // it will automatically send the 'jwt' cookie if it exists.
      const response = await userService.getProfile();

      // Flexible check for different data structures
      const userData = response?.data?.user || response?.user;

      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      // If 401 occurs, it just means the session expired or no cookie exists
      console.log("No active session found.");
      setUser(null);
      localStorage.removeItem("token");
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
      const message = err.response?.data?.message || "Login failed";
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
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
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
    return hasRole(["AUTHOR", "EDITOR", "ADMIN"]);
  };

  // Check if user can moderate (EDITOR, ADMIN)
  const canModerate = () => {
    return hasRole(["EDITOR", "ADMIN"]);
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole("ADMIN");
  };

  const value = {
    user,
    setUser,
    setIsAuthenticated: (val) => setUser(val ? user : null),
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
// export { AuthContext };
export default AuthProvider;
