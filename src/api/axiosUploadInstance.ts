// src/api/axiosUploadInstance.ts
import axios from 'axios';

const axiosUploadInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

axiosUploadInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('partner_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosUploadInstance;
