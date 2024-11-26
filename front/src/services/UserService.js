// UserService.js

import axios from 'axios';
import { axiosInstance } from './authService';


const userService = {
   // הרשמת משתמש חדש למערכת
   register: async (userData) => {
       try {
           console.log('Registering user:', userData);
           const response = await axiosInstance.post('', userData);
           
           // אם ההרשמה הצליחה, שמור את פרטי המשתמש ב-localStorage
           if (response.data.status === 'success') {
               localStorage.setItem('user', JSON.stringify(response.data.data));
           }
           
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
           const response = await axiosInstance.post('/login', credentials);
           
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

   // עדכון פרטים אישיים של המשתמש
   updateMyPersonalDetails: async (personalDetails) => {
       try {
           // שליחת בקשת PUT לעדכון פרטים
           const response = await axiosInstance.put('/me/personal-details', personalDetails);
           return response.data;
       } catch (error) {
           console.error('Update details error:', error.response?.data || error);
           throw error.response?.data || error;
       }
   },

   // יצירת פרטים אישיים חדשים למשתמש
   createMyPersonalDetails: async (personalDetails) => {
       try {
           // שליחת בקשת POST ליצירת פרטים חדשים
           const response = await axiosInstance.post('/me/personal-details', personalDetails);
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
           axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       } else {
           delete axiosInstance.defaults.headers.common['Authorization'];
       }
   }
};

// הוספת interceptor לטיפול בשגיאות
axiosInstance.interceptors.response.use(
   response => response,
   error => {
       // אם יש שגיאת אימות (401), נתנתק את המשתמש
       if (error.response?.status === 401) {
           userService.logout();
           window.location.href = '/login';
       }
       return Promise.reject(error);
   }
);

export default userService;