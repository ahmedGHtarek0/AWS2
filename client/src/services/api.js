import axios from 'axios';

const API = axios.create({
    baseURL: 'http://54.166.136.167:5000/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const uploadPrescription = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const checkInteractions = (drugs) => API.post('/check-interaction', { drugs });
export const savePrescription = (data) => API.post('/prescriptions', data);
export const getHistory = () => API.get('/prescriptions');

export default API;
