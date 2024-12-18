import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleCalendar from './GoogleCalendar';
import { authService } from '../services/authService';
import WorkoutHistory from './WorkoutHistory';
import { API_BASE_URL } from '../config';

const UserPanel = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('general');
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
    window.addEventListener('focus', fetchWorkouts);
    return () => window.removeEventListener('focus', fetchWorkouts);
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Received non-JSON response from server");
      }

      const data = await response.json();
      setWorkouts(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to load workouts. Please try again later.');
      if (error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete workout');
      
      setWorkouts(workouts.filter(w => w._id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Failed to delete workout');
    }
  };

  const formatWorkoutTime = (date) => {
    return new Date(date).toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button 
          onClick={() => navigate('/workout-builder')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Workout
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedTab('general')}
            className={`px-4 py-2 rounded ${selectedTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Workouts
          </button>
          <button 
            onClick={() => setSelectedTab('calendar')}
            className={`px-4 py-2 rounded ${selectedTab === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setSelectedTab('history')}
            className={`px-4 py-2 rounded ${selectedTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            History
          </button>
        </div>
      </div>

      {selectedTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="bg-white shadow rounded p-4">
              <h3 className="font-bold mb-2">Workout</h3>
              <p>Start: {formatWorkoutTime(workout.startDate)}</p>
              <p>Duration: {workout.duration} minutes</p>
              <div className="mt-2">
                <h4 className="font-semibold">Exercises:</h4>
                <ul className="list-disc list-inside">
                  {workout.exercises?.map((exercise, idx) => (
                    <li key={idx}>
                      {exercise.name} 
                      {exercise.sets > 0 && exercise.reps > 0 && 
                        ` - ${exercise.sets} sets, ${exercise.reps} reps`}
                      {exercise.weight > 0 && `, ${exercise.weight}kg`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => navigate(`/workout-start/${workout._id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Start
                </button>
                <button
                  onClick={() => navigate(`/workoutupdate/${workout._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWorkout(workout._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'calendar' && <GoogleCalendar />}
      {selectedTab === 'history' && <WorkoutHistory />}
    </div>
  );
};

export default UserPanel;