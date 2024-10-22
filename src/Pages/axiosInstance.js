import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://koicareapi.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
    "Content-Encoding": "gzip",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  },
});

export default axiosInstance;
