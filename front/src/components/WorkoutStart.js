import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const WorkoutStart = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restDuration, setRestDuration] = useState(60); // Default rest duration
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const audioRef = useRef(new Audio('/notification.mp3'));
  const workoutTimerRef = useRef(null);
  const restTimerRef = useRef(null);

  useEffect(() => {
    fetchWorkout();
    return () => {
      clearInterval(workoutTimerRef.current);
      clearInterval(restTimerRef.current);
    };
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('שגיאה בטעינת האימון');
      }

      const data = await response.json();
      setWorkout(data.data);
      
      // Ensure exercises and sets are properly initialized
      const processedExercises = data.data.exercises.map(exercise => ({
        ...exercise,
        completed: false,
        sets: Array.from({ length: exercise.sets || 3 }, () => ({
          completed: false,
          restTimerStarted: false
        }))
      }));

      setExercises(processedExercises);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startWorkout = () => {
    setIsWorkoutStarted(true);
    workoutTimerRef.current = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);
  };

  const completeSet = (exerciseIndex, setIndex) => {
    // Update completed sets tracking
    setCompletedSets(prev => ({
      ...prev,
      [`${exerciseIndex}-${setIndex}`]: true
    }));

    // Update exercises to mark this set as completed
    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      newExercises[exerciseIndex].sets[setIndex] = {
        completed: true,
        restTimerStarted: true
      };

      // Check if all sets in this exercise are completed
      const allSetsCompleted = newExercises[exerciseIndex].sets.every(set => set.completed);
      
      if (allSetsCompleted) {
        // Mark the entire exercise as completed
        newExercises[exerciseIndex].completed = true;

        // If not the last exercise, move to next exercise
        if (exerciseIndex < newExercises.length - 1) {
          setCurrentExerciseIndex(exerciseIndex + 1);
          setCurrentSetIndex(0);
        }
      }

      return newExercises;
    });

    // Start rest timer for this set
    startRestTimer(exerciseIndex, setIndex);
  };

  const startRestTimer = (exerciseIndex, setIndex) => {
    // Stop any existing rest timer
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    // Update exercises to mark this set as completed and rest timer started
    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      newExercises[exerciseIndex].sets[setIndex] = {
        completed: true,
        restTimerStarted: true
      };
      return newExercises;
    });

    // Start rest timer
    setRestTimer(restDuration);
    setIsRestTimerActive(true);
    
    restTimerRef.current = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          setIsRestTimerActive(false);
          audioRef.current.play();
          
          // Reset rest timer
          setExercises(prevExercises => {
            const newExercises = [...prevExercises];
            newExercises[exerciseIndex].sets[setIndex].restTimerStarted = false;
            return newExercises;
          });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipExercise = () => {
    // Mark current exercise as completed
    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      newExercises[currentExerciseIndex].completed = true;
      return newExercises;
    });

    // Move to next exercise if possible
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFinishWorkout = async () => {
    try {
      clearInterval(workoutTimerRef.current);
      clearInterval(restTimerRef.current);
      
      const response = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          exercises: exercises,
          status: 'completed',
          duration: workoutTimer
        })
      });

      if (!response.ok) {
        throw new Error('שגיאה בשמירת האימון');
      }

      alert('האימון הושלם בהצלחה!');
      navigate('/user-panel');
    } catch (err) {
      alert(err.message);
    }
  };

  const navigateToWorkoutUpdate = () => {
    navigate(`/workout-update/${workoutId}`);
  };

  if (loading) {
    return <div className="text-center p-4">טוען...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{workout?.title || 'אימון'}</h1>
          <div className="text-lg font-semibold">
            זמן אימון: {formatTime(workoutTimer)}
          </div>
        </div>

        {!isWorkoutStarted ? (
          <button
            onClick={startWorkout}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-6"
          >
            התחל אימון
          </button>
        ) : null}

        <div className="space-y-6">
          {exercises.map((exercise, exerciseIndex) => (
            <div 
              key={exerciseIndex}
              className={`p-4 rounded-lg border ${
                exerciseIndex === currentExerciseIndex 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white'
              } ${exercise.completed ? 'opacity-50 border-green-500 bg-green-50' : ''}`}
            >
              <div className="mb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  <p className="text-gray-600">
                    {exercise.sets.length} סטים × {exercise.reps} חזרות
                    {exercise.weight > 0 && ` | ${exercise.weight} ק"ג`}
                  </p>
                </div>
                {isWorkoutStarted && exerciseIndex === currentExerciseIndex && !exercise.completed && (
                  <button
                    onClick={skipExercise}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    סיים תרגיל
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.sets.map((set, setIndex) => {
                  const canComplete = 
                    isWorkoutStarted && 
                    !set.completed && 
                    (
                      (exerciseIndex === currentExerciseIndex && setIndex === currentSetIndex) ||
                      (exerciseIndex === currentExerciseIndex && setIndex > currentSetIndex) ||
                      (exerciseIndex > currentExerciseIndex)
                    );

                  return (
                    <button
                      key={setIndex}
                      onClick={() => canComplete && completeSet(exerciseIndex, setIndex)}
                      disabled={!canComplete}
                      className={`px-4 py-2 rounded ${
                        set.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      } ${!canComplete && 'opacity-50 cursor-not-allowed'}`}
                    >
                      סט {setIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={navigateToWorkoutUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
          >
            ערוך אימון
          </button>
          <button
            onClick={handleFinishWorkout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            סיים אימון
          </button>
        </div>

        {/* Rest Timer and Controls - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200" style={{ zIndex: 1000 }}>
          <div className="container mx-auto flex flex-col items-center gap-3">
            {isRestTimerActive && (
              <div className="text-2xl font-bold text-blue-600">
                זמן מנוחה: {restTimer} שניות
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="font-medium">בחר זמן מנוחה:</label>
              <select 
                value={restDuration} 
                onChange={(e) => setRestDuration(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 שניות</option>
                <option value={30}>30 שניות</option>
                <option value={45}>45 שניות</option>
                <option value={60}>60 שניות</option>
                <option value={75}>75 שניות</option>
                <option value={90}>90 שניות</option>
                <option value={120}>2 דקות</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStart;
