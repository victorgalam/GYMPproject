import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://young-ocean-77806-2eafe9f964ec.herokuapp.com/api'
    : 'http://localhost:3000/api';

const API_URL = `${BASE_URL}/workouts`;

// יצירת instance של axios עם הגדרות בסיסיות
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת interceptor להוספת טוקן אוטומטית
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const workoutService = {
    async getWorkoutById(workoutId) {
        try {
            const response = await api.get(`${API_URL}/${workoutId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching workout:', error);
            throw error;
        }
    },

    async getUserWorkouts() {
        try {
            const response = await api.get(`${API_URL}/my`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user workouts:', error);
            throw error;
        }
    }
};

export default workoutService;
