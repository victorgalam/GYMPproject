import axios from 'axios';
import { authService } from './authService';
import { API_BASE_URL } from '../config';

// יצירת instance של axios עם הגדרות בסיסיות
const api = axios.create({
    baseURL: API_BASE_URL,
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

export const completedWorkoutService = {
    async completeWorkout(workoutId, workoutData) {
        try {
            console.log('=== Debug Complete Workout ===');
            console.log('Workout ID:', workoutId);
            console.log('Workout Data:', JSON.stringify(workoutData, null, 2));

            const response = await api.post(`/completed-workouts/complete/${workoutId}`, workoutData);
            return response.data;
        } catch (error) {
            console.error('=== Debug Error ===');
            console.error('Error completing workout:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw error;
        }
    },

    async getCompletedWorkouts() {
        try {
            const response = await api.get(`/completed-workouts/completed`);
            console.log('Fetched completed workouts:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting completed workouts:', error);
            throw error;
        }
    },

    async getWorkoutStats(userId, startDate, endDate) {
        try {
            console.log('=== Debug Workout Stats Request ===');
            console.log('User ID:', userId);
            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);

            const params = new URLSearchParams();
            if (userId) params.append('userId', userId);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/completed-workouts/stats?${params}`);

            console.log('=== Debug Workout Stats Response ===');
            console.log('Response Data:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error fetching workout stats:', error);
            throw error;
        }
    }
};

export default completedWorkoutService;
