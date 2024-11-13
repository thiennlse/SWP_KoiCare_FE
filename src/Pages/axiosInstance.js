import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://koicare-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "Content-Encoding": "gzip",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
