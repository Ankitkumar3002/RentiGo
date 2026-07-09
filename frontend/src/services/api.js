import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/api/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken",  data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────────────
export const authAPI = {
  register:    (data)  => api.post("/auth/register", data),
  login:       (data)  => api.post("/auth/login", data),
  googleLogin: (data)  => api.post("/auth/google", data),
  logout:      ()      => api.post("/auth/logout"),
  getMe:       ()      => api.get("/auth/me"),
  becomeHost:  ()      => api.post("/auth/become-host"),
};

// ── Vehicles ───────────────────────────────────────────
export const vehicleAPI = {
  getAll:    (params) => api.get("/vehicles", { params }),
  getById:   (id)     => api.get(`/vehicles/${id}`),
  create:    (data)   => api.post("/vehicles", data),
  update:    (id, d)  => api.put(`/vehicles/${id}`, d),
  block:     (id, d)  => api.post(`/vehicles/${id}/block`, d),
};

// ── Bookings ───────────────────────────────────────────
export const bookingAPI = {
  create:        (data)        => api.post("/bookings", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getMy:         (params)      => api.get("/bookings/my", { params }),
  getAgency:     (params)      => api.get("/bookings/agency", { params }),
  updateStatus:  (id, data)    => api.patch(`/bookings/${id}/status`, data),
  cancel:        (id, data)    => api.patch(`/bookings/${id}/cancel`, data),
};

// ── Admin ──────────────────────────────────────────────
export const adminAPI = {
  getStats:        ()       => api.get("/admin/stats"),
  getUsers:        (params) => api.get("/admin/users", { params }),
  updateUserStatus:(id, d)  => api.patch(`/admin/users/${id}/status`, d),
  approveVehicle:  (id)     => api.patch(`/admin/vehicles/${id}/approve`),
  getAnalytics:    ()       => api.get("/admin/analytics"),
};

// ── Agency ─────────────────────────────────────────────
export const agencyAPI = {
  getFleet:       ()         => api.get("/agency/fleet"),
  getActiveRentals:()        => api.get("/agency/rentals/active"),
  updatePricing:  (vid, d)   => api.put(`/agency/pricing/${vid}`, d),
};

export default api;
