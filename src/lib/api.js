import axios from "axios";

// ✅ Base instance using your .env variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:3000 or live URL
});

// ✅ Optional: Global error & message handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error?.response?.data?.message || error.message;
    console.error("API Error:", msg);
    return Promise.reject(msg);
  }
);

export default api;
