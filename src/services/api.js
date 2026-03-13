import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
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

// Reservations & Purchases
export const createReservation = (data) => api.post("/reservations", data);
export const createPurchase = (data) => api.post("/purchases", data);
export const createSubmission = (data) => api.post("/submissions", data);
export const uploadPublicImages = (files) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  return api.post("/submissions/images", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getReservations = (params) =>
  api.get("/backoffice/reservations", { params });
export const updateReservationStatus = (id, data) =>
  api.put(`/backoffice/reservations/${id}`, data);
export const deleteReservation = (id) =>
  api.delete(`/backoffice/reservations/${id}`);
export const getPurchases = (params) =>
  api.get("/backoffice/purchases", { params });
export const updatePurchaseStatus = (id, data) =>
  api.put(`/backoffice/purchases/${id}`, data);
export const deletePurchase = (id) =>
  api.delete(`/backoffice/purchases/${id}`);

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

// Submissions
export const getAdminSubmissions = () => api.get("/backoffice/submissions");
export const getSubmissionById = (id) => api.get(`/backoffice/submissions/${id}`);
export const approveSubmission = (id, data) =>
  api.put(`/backoffice/submissions/${id}/approve`, data);
export const rejectSubmission = (id) =>
  api.put(`/backoffice/submissions/${id}/reject`);

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
