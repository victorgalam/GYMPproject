import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleCalendar from './GoogleCalendar';
import { authService } from '../services/authService';
import WorkoutHistory from './WorkoutHistory';
import { API_BASE_URL } from '../config';

const defaultWorkoutPlan = [
  { day: "ראשון", workouts: [] },
  { day: "שני", workouts: [] },
  { day: "שלישי", workouts: [] },
  { day: "רביעי", workouts: [] },
  { day: "חמישי", workouts: [] },
  { day: "שישי", workouts: [] },
  { day: "שבת", workouts: [] }
];

const DesktopHome = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('general');
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]); // הוספת state חדש
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkoutPlan();
    if (selectedTab === 'history') {
      fetchCompletedWorkouts();
    }
  }, [selectedTab]);

  // Add new effect to refresh workouts when component mounts or gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchWorkoutPlan();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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

  const fetchCompletedWorkouts = async () => {
    try {
      console.log('מנסה להביא אימונים שהושלמו...');
      const response = await fetch(`${API_BASE_URL}/api/completed-workout/completed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('תשובה מהשרת:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('אימונים שהושלמו:', data);
        setCompletedWorkouts(data);
      } else {
        const errorText = await response.text();
        console.error('שגיאה בקבלת אימונים:', response.status, errorText);
      }
    } catch (error) {
      console.error('שגיאה בקבלת אימונים שהושלמו:', error);
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

  // פונקציה לפורמט שם תרגיל
  const formatExerciseName = (exercise) => {
    if (!exercise) return '';
    return exercise.name || '';
  };

  // פונקציה לפורמט תאריך ושעה
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('he-IL'),
      time: date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // פונקציה למיון אימונים לפי תאריך ושעה
  const sortWorkouts = (workouts) => {
    if (!Array.isArray(workouts)) return [];
    return [...workouts].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  };

  // פונקציה להסרת אימונים כפולים
  const removeDuplicateWorkouts = (workouts) => {
    if (!Array.isArray(workouts)) return [];
    const uniqueWorkouts = new Map();
    workouts.forEach(workout => {
      if (!uniqueWorkouts.has(workout._id)) {
        uniqueWorkouts.set(workout._id, workout);
      }
    });
    return Array.from(uniqueWorkouts.values());
  };

  const daysInHebrew = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const formatWorkoutDateTime = (workout) => {
    const date = new Date(workout.startDate);
    const dayOfWeek = daysInHebrew[date.getDay()];
    const formattedDate = date.toLocaleDateString('he-IL');
    const startTime = new Date(workout.startDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(workout.endDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const duration = workout.duration;

    return (
      <div style={{ margin: '10px 0' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
          <span>יום {dayOfWeek} - </span>
          <span>{formattedDate}</span>
        </div>
        <div style={{ color: '#666', fontSize: '0.95em' }}>
          <div>שעת התחלה: {startTime}</div>
          <div>שעת סיום: {endTime}</div>
          <div>משך האימון: {duration} דקות</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 hidden md:block" dir="rtl">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">תוכנית אימונים שבועית</h1>
        
        {/* First row: Action buttons */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/workout-builder')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              הוסף אימון
            </button>
            
            <button
              onClick={handleGoogleCalendarSync}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.2 17.55l-4.35-4.35 1.65-1.65 2.7 2.7 5.7-5.7 1.65 1.65-7.35 7.35z"/>
              </svg>
              פתח יומן Google
            </button>
          </div>
        </div>
        
        {/* Second row: Tab navigation */}
        <div className="flex space-x-4">
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
            className={`px-4 py-2 rounded-lg ${
              selectedTab === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedTab('history')}
          >
            היסטוריית אימונים
          </button>
        </div>
      </div>
      
      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Content Section */}
      {selectedTab === 'general' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {removeDuplicateWorkouts(sortWorkouts(workouts)).map((workout) => {
            return (
              <div key={workout._id} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  אימון
                </h3>
                {formatWorkoutDateTime(workout)}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">תרגילים:</h4>
                  <ul className="list-disc list-inside">
                    {Array.isArray(workout.exercises) && workout.exercises.map((exercise, index) => (
                      <li key={index} className="mb-1">
                        {exercise.name}
                        {exercise.sets > 0 && exercise.reps > 0 && ` - ${exercise.sets} סטים, ${exercise.reps} חזרות`}
                        {exercise.weight > 0 && `, משקל: ${exercise.weight} ק"ג`}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/workout-start/${workout._id}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ml-2"
                  >
                    התחל אימון
                  </button>
                  <button
                    onClick={() => navigateToWorkoutUpdate(workout._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded ml-2"
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
            );
          })}
        </div>
      ) : selectedTab === 'calendar' ? (
        <div className="bg-white rounded-lg shadow-md">
          <GoogleCalendar />
        </div>
      ) : (
        <WorkoutHistory />
      )}
    </div>
  );
};

const MobileHome = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('general');
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]); // הוספת state חדש
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkoutPlan();
    if (selectedTab === 'history') {
      fetchCompletedWorkouts();
    }
  }, [selectedTab]);

  // Add new effect to refresh workouts when component mounts or gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchWorkoutPlan();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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

  const fetchCompletedWorkouts = async () => {
    try {
      console.log('מנסה להביא אימונים שהושלמו...');
      const response = await fetch(`${API_BASE_URL}/api/completed-workout/completed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('תשובה מהשרת:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('אימונים שהושלמו:', data);
        setCompletedWorkouts(data);
      } else {
        const errorText = await response.text();
        console.error('שגיאה בקבלת אימונים:', response.status, errorText);
      }
    } catch (error) {
      console.error('שגיאה בקבלת אימונים שהושלמו:', error);
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

  // פונקציה לפורמט שם תרגיל
  const formatExerciseName = (exercise) => {
    if (!exercise) return '';
    return exercise.name || '';
  };

  // פונקציה לפורמט תאריך ושעה
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('he-IL'),
      time: date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // פונקציה למיון אימונים לפי תאריך ושעה
  const sortWorkouts = (workouts) => {
    if (!Array.isArray(workouts)) return [];
    return [...workouts].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  };

  // פונקציה להסרת אימונים כפולים
  const removeDuplicateWorkouts = (workouts) => {
    if (!Array.isArray(workouts)) return [];
    const uniqueWorkouts = new Map();
    workouts.forEach(workout => {
      if (!uniqueWorkouts.has(workout._id)) {
        uniqueWorkouts.set(workout._id, workout);
      }
    });
    return Array.from(uniqueWorkouts.values());
  };

  const daysInHebrew = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const formatWorkoutDateTime = (workout) => {
    const date = new Date(workout.startDate);
    const dayOfWeek = daysInHebrew[date.getDay()];
    const formattedDate = date.toLocaleDateString('he-IL');
    const startTime = new Date(workout.startDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(workout.endDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const duration = workout.duration;

    return (
      <div style={{ margin: '10px 0' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
          <span>יום {dayOfWeek} - </span>
          <span>{formattedDate}</span>
        </div>
        <div style={{ color: '#666', fontSize: '0.95em' }}>
          <div>שעת התחלה: {startTime}</div>
          <div>שעת סיום: {endTime}</div>
          <div>משך האימון: {duration} דקות</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:hidden" dir="rtl">
      {/* Navigation and Action Section */}
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">תוכנית אימונים שבועית</h1>
        
        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/workout-builder')}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>הוסף אימון</span>
          </button>
          
          <button
            onClick={handleGoogleCalendarSync}
            className="bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.2 17.55l-4.35-4.35 1.65-1.65 2.7 2.7 5.7-5.7 1.65 1.65-7.35 7.35z"/>
            </svg>
            <span>פתח יומן Google</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedTab === 'general' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('general')}
          >
            תוכנית אימונים
          </button>
          <button
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedTab === 'calendar' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('calendar')}
          >
            יומן
          </button>
          <button
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedTab === 'history' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTab('history')}
          >
            היסטוריית אימונים
          </button>
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Content Section */}
      {selectedTab === 'general' ? (
        <div className="space-y-4">
          {removeDuplicateWorkouts(sortWorkouts(workouts)).map((workout) => {
            return (
              <div 
                key={workout._id} 
                className="bg-white shadow-lg rounded-xl p-6 border-2 border-blue-50 hover:border-blue-100 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  אימון
                </h3>
                
                {formatWorkoutDateTime(workout)}

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">תרגילים:</h4>
                  <ul className="list-disc list-inside">
                    {Array.isArray(workout.exercises) && workout.exercises.map((exercise, index) => (
                      <li key={index} className="mb-1">
                        {exercise.name}
                        {exercise.sets > 0 && exercise.reps > 0 && ` - ${exercise.sets} סטים, ${exercise.reps} חזרות`}
                        {exercise.weight > 0 && `, משקל: ${exercise.weight} ק"ג`}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/workout-start/${workout._id}`)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>התחל אימון</span>
                  </button>
                  
                  <button
                    onClick={() => navigateToWorkoutUpdate(workout._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    <span>ערוך</span>
                  </button>
                  
                  <button
                    onClick={() => deleteWorkout(workout._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>מחק</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedTab === 'calendar' ? (
        <div className="bg-white rounded-lg shadow-md">
          <GoogleCalendar />
        </div>
      ) : (
        <WorkoutHistory />
      )}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <DesktopHome className="hidden md:block" />
      <MobileHome className="md:hidden" />
    </>
  );
};

export default Home;