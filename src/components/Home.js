import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // נתוני המשתמש
  const [userData, setUserData] = useState({
    name: '',
    trainer: '',
    trainerId: null
  });

  // פונקציה לטעינת נתוני המשתמש מה-DB
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/data');
      const data = await response.json();
      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // פונקציה לטעינת התקדמות המשתמש
  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/user/progress');
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
      const response = await fetch('/api/user/workouts');
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
      const response = await fetch('/api/workouts/update', {
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
      const response = await fetch('/api/workouts/complete', {
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
        fetchProgress();
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  // טעינת כל הנתונים בעת טעינת הדף
  useEffect(() => {
    fetchUserData();
    fetchProgress();
    fetchWorkoutPlan();
  }, []);

  // פונקציית התנתקות
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">GYM</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200">
                פרופיל
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-200"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* תפריט טאבים */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setSelectedTab('general')}
              className={`px-4 py-4 border-b-2 transition duration-200 ${
                selectedTab === 'general' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              פרטים כללים
            </button>
            <button
              onClick={() => setSelectedTab('workouts')}
              className={`px-4 py-4 border-b-2 transition duration-200 ${
                selectedTab === 'workouts' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              מעקב אימונים
            </button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {selectedTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* כרטיס פרטים אישיים */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">פרטים אישיים</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">שם:</h3>
                  <p>{userData.name || 'טרם הוגדר'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">המאמן שלי:</h3>
                  <p>{userData.trainer || 'טרם הוגדר'}</p>
                  <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200">
                    החלף מאמן
                  </button>
                </div>
              </div>
            </div>

            {/* כרטיס התקדמות חודשית */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">התקדמות חודשית</h2>
              </div>
              <div className="space-y-4">
                {/* כוח */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>כוח</span>
                    <span>{progressData.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progressData.strength}%` }}
                    />
                  </div>
                </div>
                {/* סיבולת */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>סיבולת</span>
                    <span>{progressData.endurance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progressData.endurance}%` }}
                    />
                  </div>
                </div>
                {/* גמישות */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>גמישות</span>
                    <span>{progressData.flexibility}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progressData.flexibility}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* כרטיס תוכנית אימונים */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">תוכנית אימונים שבועית</h2>
              </div>
              <div className="h-[400px] overflow-y-auto pr-2 space-y-4">
                {workoutPlan.map((day, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-semibold">יום {day.day}</p>
                      <div className="space-y-1">
                        {day.workouts.length > 0 ? (
                          day.workouts.map((workout, wIndex) => (
                            <p key={wIndex} className="text-gray-600 flex items-center">
                              <span className={workout.completed ? 'text-green-500' : ''}>
                                {workout.type}
                              </span>
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">אין אימונים מתוכננים</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <button 
                        onClick={() => updateWorkout(index, { type: 'אימון חדש', completed: false })}
                        className="text-blue-600 hover:text-blue-800 transition duration-200">
                        ערוך
                      </button>
                      {day.workouts.length > 0 && (
                        <button 
                          onClick={() => toggleWorkoutCompletion(index, day.workouts[0].id)}
                          className="text-green-600 hover:text-green-800 transition duration-200">
                          ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'workouts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* סרגל צד */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">יומן אימונים</h2>
              <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                {workoutPlan.map((day, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{day.day}</h3>
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => updateWorkout(index, { type: 'אימון חדש', completed: false })}
                          className="text-sm text-blue-600 hover:text-blue-800 transition duration-200">
                          ערוך
                        </button>
                        {day.workouts.length > 0 && (
                          <button
                            onClick={() => toggleWorkoutCompletion(index, day.workouts[0].id)}
                            className="text-sm text-green-600 hover:text-green-800 transition duration-200">
                            ✓
                          </button>
                        )}
                      </div>
                    </div>
                    {day.workouts.length > 0 ? (
                      day.workouts.map((workout, wIndex) => (
                        <p key={wIndex} className="text-sm text-gray-600">
                          {workout.type}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">אין אימונים מתוכננים</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* אזור תוכן ראשי */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* יומנים */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">יומנים</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">יומן אימונים שבועי</p>
                    <p className="text-gray-600">יומן תזונה</p>
                    <p className="text-gray-600">יומן מדידות</p>
                  </div>
                </div>

                {/* קטגוריות */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">קטגוריות אימונים</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">אימוני כוח</p>
                    <p className="text-gray-600">אימוני קרדיו</p>
                    <p className="text-gray-600">יוגה ומתיחות</p>
                    <p className="text-gray-600">אימוני HIIT</p>
                  </div>
                </div>
              </div>

              {/* כפתורי פעולה */}
              <div className="flex justify-center space-x-4 space-x-reverse">
                <button 
                  onClick={() => {/* הוסף לוגיקה ליצירת אימון */}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-200">
                  צור אימון חדש
                </button>
                <button 
                  onClick={() => {/* הוסף לוגיקה להצגת סטטיסטיקות */}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-200">
                  הצג סטטיסטיקות
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;