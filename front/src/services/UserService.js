// UserService.js

import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://young-ocean-77806-2eafe9f964ec.herokuapp.com/api'
    : 'http://localhost:3000/api';

const API_URL = `${BASE_URL}/users`;

const userService = {
   // הרשמת משתמש חדש למערכת
   register: async (userData) => {
       try {
           const response = await axios.post(`${API_URL}/register`, userData);
           return response.data;
       } catch (error) {
           console.error('Registration error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // התחברות משתמש קיים
   login: async (credentials) => {
       try {
           console.log('Login attempt:', credentials);
           const response = await axios.post(`${API_URL}/login`, credentials);
           
           // אם ההתחברות הצליחה, שמור את פרטי המשתמש ב-localStorage
           if (response.data.status === 'success') {
               localStorage.setItem('user', JSON.stringify(response.data.data.user));
           }
           
           return response.data;
       } catch (error) {
           console.error('Login error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // התנתקות והסרת פרטי המשתמש מה-localStorage
   logout: () => {
       localStorage.removeItem('user');
   },

   // קבלת כל המשתמשים (למנהלים)
   getUsers: async () => {
       try {
           const response = await axios.get(`${API_URL}`);
           return response.data;
       } catch (error) {
           console.error('Get users error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // יצירת משתמש חדש (למנהלים)
   createUser: async (userData) => {
       try {
           const response = await axios.post(`${API_URL}`, userData);
           return response.data;
       } catch (error) {
           console.error('Create user error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // עדכון פרטים אישיים של המשתמש
   updateMyPersonalDetails: async (personalDetails) => {
       try {
           const response = await axios.put(`${API_URL}/personal-details`, personalDetails, {
               headers: {
                   'Authorization': `Bearer ${authService.getToken()}`
               }
           });
           return response.data;
       } catch (error) {
           console.error('Update details error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // קבלת הפרטים האישיים של המשתמש המחובר
   getMyPersonalDetails: async () => {
       try {
           const response = await axios.get(`${API_URL}/personal-details/me`, {
               headers: {
                   'Authorization': `Bearer ${authService.getToken()}`
               }
           });
           return response.data;
       } catch (error) {
           console.error('Get personal details error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // יצירת פרטים אישיים חדשים למשתמש
   createMyPersonalDetails: async (personalDetails) => {
       try {
           const response = await axios.post(`${API_URL}/personal-details`, personalDetails, {
               headers: {
                   'Authorization': `Bearer ${authService.getToken()}`
               }
           });
           return response.data;
       } catch (error) {
           console.error('Create details error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // קבלת פרטי המשתמש המחובר מה-localStorage
   getCurrentUser: () => {
       return JSON.parse(localStorage.getItem('user'));
   },

   // בדיקה האם יש משתמש מחובר
   isLoggedIn: () => {
       return !!localStorage.getItem('user');
   },

   // הוספת טוקן לכותרות הבקשה
   setAuthToken: (token) => {
       if (token) {
           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       } else {
           delete axios.defaults.headers.common['Authorization'];
       }
   }
};

export { userService };