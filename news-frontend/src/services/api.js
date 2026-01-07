import axios from "axios";

const API_URL = "http://localhost:8003";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================
export const authService = {
  register: async (userData) => {
    const res = await api.post("/api/auth/register", userData);
    if (res.data?.data?.token)
      localStorage.setItem("token", res.data.data.token);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post("/api/auth/login", credentials);
    if (res.data?.data?.token)
      localStorage.setItem("token", res.data.data.token);
    return res.data;
  },
  googleLogin: async (accessToken) => {
    const res = await api.post("/api/auth/google-login", {
      token: accessToken,
    });
    if (res.data?.data?.token)
      localStorage.setItem("token", res.data.data.token);
    return res.data;
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },
};

// ==================== ARTICLE SERVICES ====================
export const articleService = {
  getAll: (params = {}) =>
    api.get("/api/article", { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/api/article/${slug}`).then((r) => r.data),
  create: (data) => api.post("/api/article", data).then((r) => r.data),
  update: (id, data) => api.put(`/api/article/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/article/${id}`).then((r) => r.data),
  like: (id) => api.post(`/api/article/${id}/like`).then((r) => r.data),
};

// ==================== MEDIA SERVICES (THE MISSING LINK) ====================
export const mediaService = {
  // Get all images/videos from the gallery
  getAll: () => api.get("/api/media").then((r) => r.data),

  // Upload a new file (supports progress tracking if needed later)
  upload: (formData) =>
    api
      .post("/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};

// ==================== CATEGORY & TAG SERVICES ====================
export const categoryService = {
  getAll: () => api.get("/api/category").then((r) => r.data),
  create: (data) => api.post("/api/category", data).then((r) => r.data),
};

export const tagService = {
  getAll: () => api.get("/api/tag").then((r) => r.data),
  create: (data) => api.post("/api/tag", data).then((r) => r.data),
};

// ==================== COMMENT SERVICES ====================
export const commentService = {
  getArticleComments: (articleId) =>
    api.get(`/api/comment/article/${articleId}`).then((r) => r.data),
  create: (data) => api.post("/api/comment", data).then((r) => r.data),
  delete: (id) => api.delete(`/api/comment/${id}`).then((r) => r.data),
};

// ==================== USER SERVICES ====================
export const userService = {
  getProfile: () => api.get("/api/user/me/profile").then((r) => r.data),
  updateProfile: (data) =>
    api.put("/api/user/me/profile", data).then((r) => r.data),
  getAll: (params = {}) => api.get("/api/user", { params }).then((r) => r.data),
};

export default api;
