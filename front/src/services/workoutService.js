import api from './api';

const workoutService = {
    async createWorkout(workoutData) {
        try {
            console.log('Creating workout:', workoutData);
            const response = await api.post('/api/workouts', workoutData);
            return response.data;
        } catch (error) {
            console.error('Error creating workout:', error);
            throw error;
        }
    },

    async getMyWorkouts() {
        try {
            const response = await api.get('/api/workouts/my');
            return response.data;
        } catch (error) {
            console.error('Error fetching workouts:', error);
            throw error;
        }
    },

    async updateWorkout(workoutId, workoutData) {
        try {
            const response = await api.put(`/api/workouts/${workoutId}`, workoutData);
            return response.data;
        } catch (error) {
            console.error('Error updating workout:', error);
            throw error;
        }
    },

    async deleteWorkout(workoutId) {
        try {
            const response = await api.delete(`/api/workouts/${workoutId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting workout:', error);
            throw error;
        }
    }
};

export default workoutService;
