import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to all admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("tr_token");
      localStorage.removeItem("tr_user");
      window.location.href = "/backoffice/login";
    }
    return Promise.reject(err);
  },
);

// ─── Public ───────────────────────────────────────────────
export const getArticles = (params) => api.get("/articles", { params });
export const getArticleById = (id) => api.get(`/articles/${id}`);

// ─── Auth ─────────────────────────────────────────────────
export const login = (data) => api.post("/auth/login", data);

// ─── Admin ────────────────────────────────────────────────
export const getDashboard = () => api.get("/backoffice/dashboard");
export const getAdminArticles = (params) =>
  api.get("/backoffice/articles", { params });
export const createArticle = (data) => api.post("/backoffice/articles", data);
export const updateArticle = (id, data) =>
  api.put(`/backoffice/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/backoffice/articles/${id}`);

export const uploadImages = (id, files) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  return api.post(`/backoffice/articles/${id}/images`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteImage = (id, filename) =>
  api.delete(`/backoffice/articles/${id}/images/${filename}`);

export default api;
