import axios from 'axios';

<<<<<<< HEAD
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage to every request
api.interceptors.request.use(
=======
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Interceptor to attach JWT token from localStorage to Authorization header
API.interceptors.request.use(
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
<<<<<<< HEAD
  (error) => Promise.reject(error)
);

export default api;
=======
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
