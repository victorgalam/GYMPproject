import api from './api';

const workoutService = {
    async createWorkout(workoutData) {
        try {
            console.log('יוצר אימון:', workoutData);
            const response = await api.post('/api/workouts', workoutData);
            return response.data;
        } catch (error) {
            console.error('שגיאה ביצירת אימון:', error);
            throw error;
        }
    },

    async getMyWorkouts() {
        try {
            const response = await api.get('/api/workouts/my');
            return response.data;
        } catch (error) {
            console.error('שגיאה בטעינת אימונים:', error);
            throw error;
        }
    },

    async updateWorkout(workoutId, workoutData) {
        try {
            const response = await api.put(`/api/workouts/${workoutId}`, workoutData);
            return response.data;
        } catch (error) {
            console.error('שגיאה בעדכון אימון:', error);
            throw error;
        }
    },

    async deleteWorkout(workoutId) {
        try {
            const response = await api.delete(`/api/workouts/${workoutId}`);
            return response.data;
        } catch (error) {
            console.error('שגיאה במחיקת אימון:', error);
            throw error;
        }
    }
};

export default workoutService;
