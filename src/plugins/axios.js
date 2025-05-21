import axios from "axios";

const axiosIns = axios.create({
  baseURL: "http://100.100.0.26/auth-service/api",
  // baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosIns.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hrmsToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosIns;
