// UserService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/users';

const userService = {
    register: async (userData) => {
        try {
            console.log('Registering user:', userData);
            const response = await axios.post(API_URL, userData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Registration response:', response.data);
            
            if (response.data.status === 'success') {
                // אפשר לשמור את המשתמש ב-localStorage אם צריך
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    login: async (credentials) => {
        try {
            console.log('Login attempt:', credentials);
            const response = await axios.post(`${API_URL}/login`, credentials, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    }
};

export default userService;