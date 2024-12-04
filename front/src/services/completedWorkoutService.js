import axios from 'axios';
import { authService } from './authService';

// יצירת instance חדש של axios עם ה-baseURL הנכון
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
      const token = authService.getToken();
      
      // בדיקת הטוקן
      console.log('=== Debug Token ===');
      console.log('Token:', token);
      
      // בדיקת המידע שנשלח
      console.log('=== Debug Request Data ===');
      console.log('Workout ID:', workoutId);
      console.log('Workout Data:', workoutData);
      console.log('Full URL:', `http://localhost:3000/api/completed-workout/complete/${workoutId}`);

      const response = await api.post(`/completed-workout/complete/${workoutId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        exercises: workoutData.exercises.map(exercise => ({
          exerciseId: exercise.id || exercise._id,
          name: exercise.name || '',
          sets: exercise.sets.map(set => ({
            reps: parseInt(set.reps) || 0,
            weight: parseFloat(set.weight) || 0,
            completed: true
          })),
          notes: exercise.notes || ''
        })),
        endTime: new Date().toISOString()
      });

      // בדיקת התגובה
      console.log('=== Debug Response ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.error('=== Debug Error ===');
      console.error('Full Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);

      throw new Error(error.response?.data?.message || error.message || 'שגיאה בשמירת האימון');
    }
  },

  async getCompletedWorkouts() {
    try {
      const token = authService.getToken();
      
      // בדיקת הטוקן
      console.log('=== Debug Completed Workouts Token ===');
      console.log('Token:', token);
      console.log('Full URL:', 'http://localhost:3000/api/completed-workout');

      const response = await api.get('/completed-workout');

      // בדיקת התגובה
      console.log('=== Debug Completed Workouts Response ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.error('=== Debug Completed Workouts Error ===');
      console.error('Full Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);

      throw new Error(error.response?.data?.message || 'שגיאה בקבלת אימונים שהושלמו');
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

      const fullUrl = `http://localhost:3000/api/completed-workout/stats?${params}`;
      console.log('Full URL:', fullUrl);

      const response = await api.get(`/completed-workout/stats?${params}`);

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
