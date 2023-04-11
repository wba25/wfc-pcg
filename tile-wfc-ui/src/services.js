import axios from "axios";

const url = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: `${url}/api/`,
  headers: {}
});

axiosInstance.interceptors.request.use(
  // function(config) {
  //   const token = window.localStorage.token;
  //   if (token) {
  //     config.headers.Authorization = "Bearer " + token;
  //   }
  //   return config;
  // },
  function(error) {
    return Promise.reject(error);
  }
);

export const api = {
  get(endpoint, params) {
    return axiosInstance.get(endpoint, { params });
  },
  post(endpoint, body) {
    return axiosInstance.post(endpoint, body);
  },
  put(endpoint, body) {
    return axiosInstance.put(endpoint, body);
  },
  delete(endpoint) {
    return axiosInstance.delete(endpoint);
  }
};
