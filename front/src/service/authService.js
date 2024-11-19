import axios from 'axios';
// src/services/authService.js

const TOKEN_KEY = 'auth_token';

export const authService = {
    // שמירת טוקן
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // קבלת טוקן
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // מחיקת טוקן (התנתקות)
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    // בדיקה אם המשתמש מחובר
    isAuthenticated() {
        return !!this.getToken();
    },

    // הוספת הדר לבקשות
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// Axios instance with interceptors

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// הוספת טוקן לכל בקשה
api.interceptors.request.use(config => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// טיפול בשגיאות אימות
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            authService.removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;