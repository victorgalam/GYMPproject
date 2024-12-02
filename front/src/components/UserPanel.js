import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleCalendar from './GoogleCalendar';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:3000';

const defaultWorkoutPlan = [
  { day: "ראשון", workouts: [] },
  { day: "שני", workouts: [] },
  { day: "שלישי", workouts: [] },
  { day: "רביעי", workouts: [] },
  { day: "חמישי", workouts: [] },
  { day: "שישי", workouts: [] },
  { day: "שבת", workouts: [] }
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('general');
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בקבלת האימונים');
      }

      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        setWorkouts(result.data);
      } else {
        console.error('התקבל מבנה נתונים לא צפוי מהשרת:', result);
        setError('שגיאה בטעינת האימונים');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('לא ניתן לטעון את האימונים כרגע. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkoutCompletion = async (dayIndex, workoutId) => {
    try {
      setError(null);
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dayIndex,
          workoutId,
          completed: !workouts.find(w => w.id === workoutId)?.completed
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בעדכון סטטוס האימון');
      }

      const data = await response.json();
      if (data.success) {
        fetchWorkoutPlan();
      }
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      setError('לא ניתן לעדכן את סטטוס האימון כרגע. אנא נסה שוב מאוחר יותר.');
    }
  };

  // פונקציה לקבלת פרטי אימון ספציפי
  const fetchWorkoutDetails = async (workoutId) => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return null;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בטעינת פרטי האימון');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching workout details:', error);
      setError('לא ניתן לטעון את פרטי האימון כרגע. אנא נסה שוב מאוחר יותר.');
      return null;
    }
  };

  // פונקציה לעדכון אימון
  const updateWorkout = async (workoutId, updatedWorkoutData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWorkoutData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return false;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בעדכון האימון');
      }

      const data = await response.json();
      fetchWorkoutPlan(); // רענון רשימת האימונים לאחר העדכון
      return true;
    } catch (error) {
      console.error('Error updating workout:', error);
      setError('לא ניתן לעדכן את האימון כרגע. אנא נסה שוב מאוחר יותר.');
      return false;
    }
  };

  // פונקציה למחיקת אימון
  const deleteWorkout = async (workoutId) => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return false;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה במחיקת האימון');
      }

      fetchWorkoutPlan(); // רענון רשימת האימונים לאחר המחיקה
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('לא ניתן למחוק את האימון כרגע. אנא נסה שוב מאוחר יותר.');
      return false;
    }
  };

  const navigateToWorkoutUpdate = (workoutId) => {
    navigate(`/workoutupdate/${workoutId}`);
  };

  const handleGoogleCalendarSync = () => {
    // פתיחת Google Calendar בחלון חדש
    window.open('https://calendar.google.com', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">תוכנית אימונים שבועית</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/workout-builder')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200 ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            הוסף אימון
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedTab === 'general' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedTab('general')}
          >
            תוכנית אימונים
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedTab === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedTab('calendar')}
          >
            יומן
          </button>
          <button
            onClick={handleGoogleCalendarSync}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            סנכרן עם יומן Google
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {selectedTab === 'general' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{workout.title}</h3>
              <p className="text-gray-600 mb-4">{workout.description}</p>
              <div className="text-sm text-gray-500">
                <p>תאריך התחלה: {new Date(workout.startDate).toLocaleDateString('he-IL')}</p>
                <p>תאריך סיום: {new Date(workout.endDate).toLocaleDateString('he-IL')}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">תרגילים:</h4>
                <ul className="list-disc list-inside">
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} className="mb-1">
                      {exercise.name} - {exercise.sets} סטים, {exercise.reps} חזרות
                      {exercise.weight > 0 && `, משקל: ${exercise.weight} ק"ג`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => navigate(`/workout-checklist/${workout._id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ml-2"
                >
                  התחל אימון
                </button>
                <button
                  onClick={() => navigateToWorkoutUpdate(workout._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded ml-2"
                >
                  ערוך
                </button>
                <button
                  onClick={() => deleteWorkout(workout._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <GoogleCalendar />
        </div>
      )}
    </div>
  );
};

export default Home;