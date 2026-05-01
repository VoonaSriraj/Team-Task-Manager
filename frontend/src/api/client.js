import axios from 'axios';

// Ensure it points to the backend API.
// In dev it's usually localhost:8000. In production on Railway it will use the relative path '/api'.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/' : 'http://localhost:8000/api/');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
