import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { authService } from '../services/authService';

const WorkoutHistory = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedWorkouts, setExpandedWorkouts] = useState(new Set());
  const workoutsPerPage = 5;
  const maxExercisesToShow = 3; // Maximum number of exercises to show initially

  const daysInHebrew = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const toggleWorkoutExpansion = (workoutId) => {
    setExpandedWorkouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

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
        const response = await axios.get(`${API_BASE_URL}/api/completed-workout/completed`, {
          headers: headers
        });
        
        // Sort workouts by date in descending order (newest first)
        const sortedWorkouts = response.data.sort((a, b) => 
          new Date(b.startTime) - new Date(a.startTime)
        );
        
        setCompletedWorkouts(sortedWorkouts);
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

  // Calculate pagination
  const totalPages = Math.ceil(completedWorkouts.length / workoutsPerPage);
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = completedWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderExercises = (workout) => {
    const isExpanded = expandedWorkouts.has(workout._id);
    const exercises = workout.exercises || [];
    const displayedExercises = isExpanded ? exercises : exercises.slice(0, maxExercisesToShow);
    const hasMoreExercises = exercises.length > maxExercisesToShow;

    return (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">תרגילים:</h4>
        <ul className="list-disc list-inside">
          {displayedExercises.map((exercise, index) => (
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
        
        {hasMoreExercises && (
          <button
            onClick={() => toggleWorkoutExpansion(workout._id)}
            className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium focus:outline-none"
          >
            {isExpanded ? 'הצג פחות' : `הצג עוד ${exercises.length - maxExercisesToShow} תרגילים`}
          </button>
        )}
      </div>
    );
  };

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
      
      <div className="text-gray-600 mb-4">
        סה"כ אימונים: {completedWorkouts.length}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentWorkouts.map((workout) => (
          <div key={workout._id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              אימון שהושלם
            </h3>
            {formatWorkoutDateTime(workout)}
            {renderExercises(workout)}
            {workout.totalVolume > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                נפח אימון כולל: {workout.totalVolume} ק"ג
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2 space-x-reverse">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            הקודם
          </button>
          
          <div className="flex space-x-2 space-x-reverse">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
