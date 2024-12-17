import axios from 'axios';
import { authService } from './authService';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://young-ocean-77806.herokuapp.com/api'
    : 'http://localhost:3000/api';

const API_URL = `${BASE_URL}/completed-workout`;

// יצירת instance חדש של axios עם ה-baseURL הנכון
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
  (error) => Promise.reject(error)
);

export const completedWorkoutService = {
  async completeWorkout(workoutId, workoutData) {
    try {
      console.log('=== Complete Workout Request ===');
      console.log('Workout ID:', workoutId);
      console.log('Workout Data:', JSON.stringify(workoutData, null, 2));

      const response = await api.post(`${API_URL}/complete/${workoutId}`, workoutData);
      return response.data;
    } catch (error) {
      console.error('=== Debug Error ===');
      console.error('Full Error:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
        console.error('Error Headers:', error.response.headers);
      } else {
        console.error('Error Message:', error.message);
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async getCompletedWorkouts() {
    try {
      const response = await api.get(`${API_URL}/completed`);
      return response.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } catch (error) {
      console.error('Error fetching completed workouts:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async getWorkoutStats(startDate, endDate) {
    try {
      const token = authService.getToken();
      
      // בדיקת הטוקן
      console.log('=== Debug Workout Stats Token ===');
      console.log('Token:', token);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const fullUrl = `${API_URL}/stats?${params}`;
      console.log('Full URL:', fullUrl);

      const response = await api.get(`${API_URL}/stats?${params}`);

      // בדיקת התגובה
      console.log('=== Debug Workout Stats Response ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.error('=== Debug Workout Stats Error ===');
      console.error('Full Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);

      throw new Error(error.response?.data?.message || 'שגיאה בקבלת סטטיסטיקות אימונים');
    }
  }
};
