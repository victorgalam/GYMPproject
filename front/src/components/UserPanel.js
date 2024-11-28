import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleCalendar from './GoogleCalendar';

const API_BASE_URL = 'http://localhost:3000'; // הוספת כתובת בסיס לשרת

const Home = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('general');
  
  // State לנתונים מה-DB
  const [progressData, setProgressData] = useState({
    strength: 0,
    endurance: 0,
    flexibility: 0
  });

  const [workoutPlan, setWorkoutPlan] = useState([
    { day: "ראשון", workouts: [] },
    { day: "שני", workouts: [] },
    { day: "שלישי", workouts: [] },
    { day: "רביעי", workouts: [] },
    { day: "חמישי", workouts: [] },
    { day: "שישי", workouts: [] },
    { day: "שבת", workouts: [] }
  ]);

  useEffect(() => {
    fetchProgress();
    fetchWorkoutPlan();
  }, []);

  // פונקציה לטעינת התקדמות המשתמש
  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/progress`);
      const data = await response.json();
      if (data.success) {
        setProgressData(data.progress);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // פונקציה לטעינת תוכנית האימונים
  const fetchWorkoutPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/workouts`);
      const data = await response.json();
      if (data.success) {
        setWorkoutPlan(data.workouts);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  // פונקציה לעדכון אימון
  const updateWorkout = async (dayIndex, workout) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workouts/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dayIndex,
          workout
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchWorkoutPlan();
      }
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  // פונקציה לסימון אימון כהושלם
  const toggleWorkoutCompletion = async (dayIndex, workoutId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workouts/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dayIndex,
          workoutId
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchWorkoutPlan();
      }
    } catch (error) {
      console.error('Error marking workout as complete:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* לשוניות ניווט */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'general' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedTab('general')}
        >
          כללי
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
      </div>

      {/* כפתור הוספת אימון */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/workout-builder')}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          הוסף אימון
        </button>
      </div>

      {selectedTab === 'general' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* תרשים התקדמות */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">התקדמות</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600">כוח</label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressData.strength}%` }}></div>
                </div>
              </div>
              <div>
                <label className="text-gray-600">סיבולת</label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressData.endurance}%` }}></div>
                </div>
              </div>
              <div>
                <label className="text-gray-600">גמישות</label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progressData.flexibility}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* תוכנית אימונים שבועית */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">תוכנית אימונים שבועית</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutPlan.map((day, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2">{day.day}</h3>
                  {day.workouts.length > 0 ? (
                    <ul className="space-y-2">
                      {day.workouts.map((workout, wIndex) => (
                        <li key={wIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={workout.completed}
                            onChange={() => toggleWorkoutCompletion(index, workout.id)}
                            className="mr-2"
                          />
                          <span className={workout.completed ? 'line-through' : ''}>
                            {workout.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">אין אימונים</p>
                  )}
                </div>
              ))}
            </div>
          </div>
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