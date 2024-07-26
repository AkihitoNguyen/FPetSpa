import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:7055/api'

});

export default api;

  // Add a request interceptor
  api.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
api.interceptors.response.use(function (response){
   
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("??run error",error.response)
    return error && error.response && error.response.data ?error.response.data : Promise.reject(error);
  });