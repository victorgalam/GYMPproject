import axios from 'axios';
import { authService } from './authService';
import { API_BASE_URL } from '../config';
import api from './api';

// יצירת instance של axios עם הגדרות בסיסיות
const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת interceptor להוספת טוקן אוטומטית
apiInstance.interceptors.request.use(
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
            console.log('=== מידע על השלמת אימון ===');
            console.log('מזהה אימון:', workoutId);
            console.log('נתוני אימון:', JSON.stringify(workoutData, null, 2));

            const response = await api.post(`/api/completed-workouts/complete/${workoutId}`, workoutData);
            return response.data;
        } catch (error) {
            console.error('=== שגיאה ===');
            console.error('שגיאה בהשלמת אימון:', error);
            console.error('תגובת שגיאה:', error.response?.data);
            console.error('סטטוס שגיאה:', error.response?.status);
            throw error;
        }
    },

    async getCompletedWorkouts() {
        try {
            const response = await api.get('/api/completed-workouts/completed');
            console.log('אימונים שהושלמו:', response.data);
            return response.data;
        } catch (error) {
            console.error('שגיאה בקבלת אימונים שהושלמו:', error);
            throw error;
        }
    },

    async getWorkoutStats(userId, startDate, endDate) {
        try {
            console.log('=== בקשת סטטיסטיקות אימון ===');
            console.log('מזהה משתמש:', userId);
            console.log('תאריך התחלה:', startDate);
            console.log('תאריך סיום:', endDate);

            const params = new URLSearchParams();
            if (userId) params.append('userId', userId);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/api/completed-workouts/stats?${params}`);
            console.log('=== תגובת סטטיסטיקות אימון ===');
            console.log('נתוני תגובה:', response.data);
            return response.data;
        } catch (error) {
            console.error('שגיאה בקבלת סטטיסטיקות אימון:', error);
            throw error;
        }
    }
};

export default completedWorkoutService;
