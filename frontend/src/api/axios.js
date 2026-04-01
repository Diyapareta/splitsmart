import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api"
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Server not reachable
    if (!error.response) {
      alert("Cannot connect to server. Please try again later.");
      return Promise.reject(error);
    }

    // 🔥 Unauthorized
    if (
      error.response.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("user");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;