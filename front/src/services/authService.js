// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// יצירת instance של axios עם הגדרות בסיסיות
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// הוספת interceptors
api.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const authService = {
    // הרשמה
    register: async (userData) => {
        try {
            console.log('Registering user:', userData);
            const response = await api.post('/users', userData);
            
            if (response.data.status === 'success') {
                if (response.data.token) {
                    localStorage.setItem(TOKEN_KEY, response.data.token);
                }
                localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
            }
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // התחברות
    login: async (credentials) => {
        try {
            console.log('Login attempt:', credentials);
            const response = await api.post('/users/login', credentials);
            
            if (response.data.status === 'success') {
                if (response.data.token) {
                    localStorage.setItem(TOKEN_KEY, response.data.token);
                }
                localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // התנתקות
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
    },

    // בדיקה אם המשתמש מחובר
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // קבלת המשתמש הנוכחי
    getCurrentUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // קבלת הטוקן
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // קבלת headers לבקשות
    getAuthHeaders: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

export { authService, api };