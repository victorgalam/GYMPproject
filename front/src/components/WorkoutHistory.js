import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { authService } from '../services/authService';

const WorkoutHistory = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysInHebrew = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const formatWorkoutDateTime = (workout) => {
    const date = new Date(workout.startTime);
    const dayOfWeek = daysInHebrew[date.getDay()];
    const formattedDate = date.toLocaleDateString('he-IL');
    const startTime = new Date(workout.startTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(workout.endTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
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

  useEffect(() => {
    const fetchCompletedWorkouts = async () => {
      try {
        setIsLoading(true);
        if (!authService.isAuthenticated()) {
          setError('אנא התחבר למערכת');
          return;
        }

        const headers = authService.getAuthHeaders();
        console.log('שולח בקשה עם headers:', headers);

        const response = await axios.get(`${API_BASE_URL}/api/completed-workout/completed`, {
          headers: headers
        });
        
        console.log('תשובה מהשרת:', response.data);
        setCompletedWorkouts(response.data);
        setError(null);
      } catch (err) {
        console.error('שגיאה בטעינת היסטוריית אימונים:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'לא ניתן לטעון את היסטוריית האימונים כרגע');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedWorkouts();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">טוען היסטוריית אימונים...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (completedWorkouts.length === 0) {
    return <div className="text-center p-4">אין אימונים שהושלמו עדיין</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">היסטוריית אימונים</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {completedWorkouts.map((workout) => (
          <div key={workout._id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              אימון שהושלם
            </h3>
            {formatWorkoutDateTime(workout)}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">תרגילים:</h4>
              <ul className="list-disc list-inside">
                {workout.exercises?.map((exercise, index) => (
                  <li key={index} className="text-gray-600">
                    {exercise.name}
                    <ul className="list-none ml-4">
                      {exercise.sets.map((set, setIndex) => (
                        <li key={setIndex} className="text-sm text-gray-500">
                          סט {setIndex + 1}: {set.reps} חזרות, {set.weight} ק"ג
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            {workout.totalVolume > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                נפח אימון כולל: {workout.totalVolume} ק"ג
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;
