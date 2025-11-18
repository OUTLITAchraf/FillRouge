import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_BASE_API_URL || "http://localhost:8000/api",
  headers: {
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
