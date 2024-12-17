import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { completedWorkoutService } from '../services/completedWorkoutService';
import { useAudio, useSpeech, formatTime, ENCOURAGEMENT_PHRASES } from './WorkoutStartSorses';

const WorkoutStart = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { playBeep, playFinishSound } = useAudio();
  const { speakText } = useSpeech();
  
  // State
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(60);
  const [restMilliseconds, setRestMilliseconds] = useState(99);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  
  // Refs for intervals
  const workoutTimerRef = useRef();
  const restTimerRef = useRef();

  // Exercise management
  const announceNextExercise = (index) => {
    if (!exercises[index]) return;
    const e = exercises[index];
    speakText(`התרגיל הבא: ${e.name}${e.sets ? `. ${e.sets.length} סטים של ${e.reps} חזרות` : ''}${e.weight > 0 ? `. משקל: ${e.weight} קילו` : ''}`);
  };

  const completeSet = (exerciseIndex, setIndex) => {
    setExercises(prev => {
      const newExercises = [...prev];
      const exercise = newExercises[exerciseIndex];
      exercise.sets[setIndex] = {
        reps: exercise.reps,
        weight: exercise.weight,
        completed: true,
        restTimerStarted: true
      };
      
      if (exercise.sets.every(s => s.completed)) {
        exercise.completed = true;
        if (exerciseIndex < newExercises.length - 1) {
          setCurrentExerciseIndex(exerciseIndex + 1);
          setCurrentSetIndex(0);
          setTimeout(() => {
            speakText(ENCOURAGEMENT_PHRASES[Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)]);
            setTimeout(() => announceNextExercise(exerciseIndex + 1), 2000);
          }, 500);
        }
      }
      
      return newExercises;
    });

    startRestTimer(exerciseIndex, setIndex);
  };

  const startRestTimer = (exerciseIndex, setIndex) => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    
    setRestTimer(restDuration);
    setRestMilliseconds(99);
    setIsRestTimerActive(true);

    const msTimer = setInterval(() => {
      setRestMilliseconds(prev => prev <= 0 ? 99 : prev - 1);
    }, 10);

    restTimerRef.current = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          clearInterval(msTimer);
          setIsRestTimerActive(false);
          setRestMilliseconds(0);
          playFinishSound();
          return 0;
        }
        if (prev <= 3) playBeep(100, 660);
        return prev - 1;
      });
    }, 1000);
  };

  // Workout lifecycle
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
          headers: { 'Authorization': `Bearer ${authService.getToken()}` }
        });
        
        if (!response.ok) throw new Error('שגיאה בטעינת האימון');
        
        const { data } = await response.json();
        setWorkout(data);
        
        setExercises(data.exercises.map(e => ({
          ...e,
          exerciseId: e.id,
          completed: false,
          sets: Array(e.sets || 3).fill().map(() => ({
            reps: e.reps || 0,
            weight: e.weight || 0,
            completed: false,
            restTimerStarted: false
          }))
        })));
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkout();
    return () => {
      clearInterval(workoutTimerRef.current);
      clearInterval(restTimerRef.current);
    };
  }, [workoutId]);

  const handleFinishWorkout = async () => {
    try {
      clearInterval(workoutTimerRef.current);
      clearInterval(restTimerRef.current);

      const completedExercises = exercises
        .filter(e => e.sets && e.sets.some(s => s.completed))
        .map(e => {
          console.log('Processing exercise:', e); // Debug log
          // וידוא שיש מזהה תקין
          const exerciseId = e._id || e.exerciseId;
          if (!exerciseId) {
            console.error('Missing exerciseId for exercise:', e);
            return null;
          }

          return {
            exerciseId: exerciseId,
            name: e.name,
            sets: e.sets.filter(s => s.completed).map(s => {
              console.log('Processing set:', s); // Debug log
              return {
                reps: parseInt(s.reps || e.reps || 0),
                weight: parseInt(s.weight || e.weight || 0),
                completed: true
              };
            })
          };
        })
        .filter(e => e !== null); // מסנן תרגילים לא תקינים

      console.log('Final completed exercises:', completedExercises); // Debug log

      if (!completedExercises.length) {
        throw new Error('לא נמצאו תרגילים תקינים לשמירה');
      }

      if (!completedExercises.every(e => e.exerciseId)) {
        throw new Error('נמצאו תרגילים ללא מזהה');
      }

      const workoutData = {
        exercises: completedExercises,
        startTime: workoutStartTime || new Date().toISOString(),
        endTime: new Date().toISOString()
      };

      await completedWorkoutService.completeWorkout(workoutId, workoutData);
      alert('כל הכבוד! סיימת את האימון בהצלחה!');
      navigate('/user-panel');
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('אירעה שגיאה בשמירת האימון: ' + error.message);
    }
  };

  // Render helpers
  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setWorkoutStartTime(new Date().toISOString());
    workoutTimerRef.current = setInterval(() => setWorkoutTimer(p => p + 1), 1000);
    announceNextExercise(0);
  };

  if (loading) return <div className="text-center p-4">טוען...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{workout?.title || 'אימון'}</h1>
          <div className="text-lg font-semibold">זמן אימון: {formatTime(workoutTimer)}</div>
        </div>

        {!isWorkoutStarted && (
          <button onClick={startWorkout} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-6">
            התחל אימון
          </button>
        )}

        <div className="space-y-6">
          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className={`p-4 rounded-lg border ${
              exerciseIndex === currentExerciseIndex ? 'border-blue-500 bg-blue-50' : 
              exercise.completed ? 'opacity-50 border-green-500 bg-green-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="mb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  <p className="text-gray-600">
                    {exercise.weight > 0 ? `משקל: ${exercise.weight} ק"ג` : 'ללא משקל'}
                  </p>
                </div>
                {isWorkoutStarted && exerciseIndex === currentExerciseIndex && !exercise.completed && (
                  <button onClick={() => {
                    setExercises(prev => {
                      const newExercises = [...prev];
                      newExercises[currentExerciseIndex].completed = true;
                      return newExercises;
                    });
                    if (currentExerciseIndex < exercises.length - 1) {
                      setCurrentExerciseIndex(p => p + 1);
                      setCurrentSetIndex(0);
                      announceNextExercise(currentExerciseIndex + 1);
                    }
                  }} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                    סיים תרגיל
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.sets.map((set, setIndex) => {
                  const canComplete = isWorkoutStarted && !set.completed && 
                    ((exerciseIndex === currentExerciseIndex && setIndex >= currentSetIndex) || 
                     exerciseIndex > currentExerciseIndex);

                  return (
                    <button key={setIndex}
                      onClick={() => canComplete && completeSet(exerciseIndex, setIndex)}
                      disabled={!canComplete}
                      className={`px-4 py-2 rounded ${
                        set.completed ? 'bg-green-500 text-white' : 
                        canComplete ? 'bg-gray-100 hover:bg-gray-200' : 
                        'bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}>
                      סט {setIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button onClick={() => navigate(`/workout-update/${workoutId}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg">
            ערוך אימון
          </button>
          <button onClick={handleFinishWorkout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
            סיים אימון
          </button>
        </div>

        {isWorkoutStarted && (
          <div className="rest-timer-container sticky bottom-0 z-50 bg-white/90 backdrop-blur-sm shadow-md border-t border-gray-200 py-3 px-4 w-full">
            <div className="container mx-auto flex flex-col items-center gap-3 max-w-screen-lg">
              {isRestTimerActive && (
                <div className="digital-clock text-4xl sm:text-5xl font-bold text-red-600 w-full text-center" 
                  style={{ letterSpacing: "2px", textShadow: "0 0 10px rgba(255, 0, 0, 0.3)" }}>
                  <div className="seconds">{String(restTimer).padStart(2, '0')}</div>
                  <div className="milliseconds text-2xl">.{String(restMilliseconds).padStart(2, '0')}</div>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap justify-center w-full">
                <label className="font-medium text-sm sm:text-base">בחר זמן מנוחה:</label>
                <select value={restDuration} 
                  onChange={(e) => setRestDuration(Number(e.target.value))}
                  className="px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  {[15, 30, 45, 60, 75, 90, 120].map(time => (
                    <option key={time} value={time}>
                      {time >= 60 ? `${Math.floor(time/60)} דקות` : `${time} שניות`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutStart;