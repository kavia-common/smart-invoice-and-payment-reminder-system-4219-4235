import axios from "axios";

// PUBLIC_INTERFACE
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "",
});

// Attach token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
