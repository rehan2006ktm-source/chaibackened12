import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If 401 and not already retrying, try to refresh token could go here
        // For now, we'll just reject to trigger logout in context
        return Promise.reject(error);
    }
);

export default api;
