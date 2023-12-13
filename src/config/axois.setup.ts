import axios from "axios";

const protectedAxios = axios.create();

protectedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AccessToken"); // Implement a function to retrieve the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default protectedAxios;
