// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1'; // וודא שזו הכתובת הנכונה של השרת

const userService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users`, userData, {
                withCredentials: true // אם אתה משתמש ב-cookies
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default userService;