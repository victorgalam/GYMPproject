import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { completedWorkoutService } from '../services/completedWorkoutService';

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
  const [restMilliseconds, setRestMilliseconds] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const audioContext = useRef(null);
  const beepSound = useRef(null);
  const workoutTimerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Encouragement phrases
  const encouragementPhrases = [
    "כל הכבוד!",
    "תותח!",
    "חזק אתה!",
    "יא חיה רעה!",
    "ימלך!"
  ];

  // Get random encouragement phrase
  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragementPhrases.length);
    return encouragementPhrases[randomIndex];
  };

  // Speech synthesis setup
  const speakText = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a Hebrew voice
    const hebrewVoice = voices.find(voice => 
      voice.lang.includes('he') || 
      voice.name.includes('Hebrew') || 
      voice.name.includes('Microsoft David')
    );

    if (hebrewVoice) {
      utterance.voice = hebrewVoice;
    }

    utterance.lang = 'he-IL';
    utterance.rate = 0.85; // קצת יותר איטי
    utterance.pitch = 1.1; // קצת יותר גבוה
    utterance.volume = 1;

    // Add event listener to handle voice loading
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      const updatedHebrewVoice = updatedVoices.find(voice => 
        voice.lang.includes('he') || 
        voice.name.includes('Hebrew') || 
        voice.name.includes('Microsoft David')
      );
      
      if (updatedHebrewVoice) {
        utterance.voice = updatedHebrewVoice;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Initialize voices when component mounts
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const announceNextExercise = (exerciseIndex) => {
    if (exercises[exerciseIndex]) {
      const exercise = exercises[exerciseIndex];
      const sets = exercise.sets.length;
      const reps = exercise.reps;
      const weight = exercise.weight;

      let announcement = `התרגיל הבא: ${exercise.name}`;
      if (sets && reps) {
        announcement += `. ${sets} סטים של ${reps} חזרות`;
      }
      if (weight > 0) {
        announcement += `. משקל: ${weight} קילו`;
      }

      speakText(announcement);
    }
  };

  useEffect(() => {
    fetchWorkout();
    return () => {
      if (workoutTimerRef.current) {
        clearInterval(workoutTimerRef.current);
      }
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [workoutId]);

  useEffect(() => {
    // Initialize Audio Context
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create beep sound
    const createBeep = (frequency = 880) => {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      gainNode.gain.value = 0.1;
      
      return { oscillator, gainNode };
    };
    
    beepSound.current = createBeep;

    return () => {
      if (workoutTimerRef.current) {
        clearInterval(workoutTimerRef.current);
      }
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, []);

  const playBeep = (duration = 100, frequency = 880) => {
    if (audioContext.current && audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    
    const { oscillator, gainNode } = beepSound.current(frequency);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
    
    // Cleanup
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, duration + 50);
  };

  const playFinishSound = () => {
    // Play three beeps with different frequencies
    playBeep(150, 880);  // High beep
    setTimeout(() => playBeep(150, 660), 200);  // Medium beep
    setTimeout(() => playBeep(250, 440), 400);  // Low beep
  };

  const fetchWorkout = async () => {
    try {
      console.log('=== Fetch Workout Auth Check ===');
      console.log('Token:', authService.getToken());
      
      const response = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('שגיאה בטעינת האימון');
      }

      const data = await response.json();
      console.log('Fetched workout data:', data);
      setWorkout(data.data);
      
      // Initialize exercises with proper set structure
      const processedExercises = data.data.exercises.map(exercise => ({
        ...exercise,
        exerciseId: exercise.id, // שמירת ה-id כ-exerciseId
        completed: false,
        sets: Array.from({ length: exercise.sets || 3 }, () => ({
          reps: exercise.reps || 0,
          weight: exercise.weight || 0,
          completed: false,
          restTimerStarted: false
        }))
      }));

      console.log('Processed exercises:', processedExercises);
      setExercises(processedExercises);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const completeSet = (exerciseIndex, setIndex) => {
    console.log(`Completing set ${setIndex} for exercise ${exerciseIndex}`);
    
    setCompletedSets(prev => ({
      ...prev,
      [`${exerciseIndex}-${setIndex}`]: true
    }));

    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      const currentExercise = newExercises[exerciseIndex];
      
      // עדכון נתוני הסט עם הערכים המקוריים מהתרגיל
      newExercises[exerciseIndex].sets[setIndex] = {
        reps: currentExercise.reps || 0,
        weight: currentExercise.weight || 0,
        completed: true,
        restTimerStarted: true
      };

      // בדיקה אם כל הסטים הושלמו
      const allSetsCompleted = newExercises[exerciseIndex].sets.every(set => set.completed);
      if (allSetsCompleted) {
        newExercises[exerciseIndex].completed = true;
        if (exerciseIndex < newExercises.length - 1) {
          setCurrentExerciseIndex(exerciseIndex + 1);
          setCurrentSetIndex(0);
        }
      }

      console.log('Updated exercise:', newExercises[exerciseIndex]);
      return newExercises;
    });

    startRestTimer(exerciseIndex, setIndex);
  };

  const startRestTimer = (exerciseIndex, setIndex) => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      newExercises[exerciseIndex].sets[setIndex] = {
        completed: true,
        restTimerStarted: true
      };
      return newExercises;
    });

    // Announce next exercise if this was the last set
    const currentExercise = exercises[exerciseIndex];
    const isLastSet = setIndex === currentExercise.sets.length - 1;
    const hasNextExercise = exerciseIndex < exercises.length - 1;

    if (isLastSet) {
      // Say random encouragement phrase
      setTimeout(() => {
        speakText(getRandomEncouragement());
      }, 500);

      if (hasNextExercise) {
        // Wait a bit before announcing next exercise
        setTimeout(() => {
          announceNextExercise(exerciseIndex + 1);
        }, 2000); // Wait longer to let the encouragement finish
      }
    }

    setRestTimer(restDuration);
    setRestMilliseconds(99);
    setIsRestTimerActive(true);
    
    // Milliseconds timer
    const msTimer = setInterval(() => {
      setRestMilliseconds(prev => {
        if (prev <= 0) {
          return 99;
        }
        return prev - 1;
      });
    }, 10);

    // Seconds timer
    restTimerRef.current = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          clearInterval(msTimer);
          setIsRestTimerActive(false);
          setRestMilliseconds(0);
          
          // Play finish sound
          playFinishSound();
          
          setExercises(prevExercises => {
            const newExercises = [...prevExercises];
            newExercises[exerciseIndex].sets[setIndex].restTimerStarted = false;
            return newExercises;
          });
          
          return 0;
        }
        // Play beep at last 3 seconds
        if (prev <= 3) {
          playBeep(100, 660); // Medium pitch for countdown
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
      // Announce next exercise
      announceNextExercise(currentExerciseIndex + 1);
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
      
      // וידוא שיש לנו את כל הנתונים הנדרשים
      const validExercises = exercises.filter(exercise => {
        if (!exercise.exerciseId || !exercise.name) {
          console.error('Missing required fields for exercise:', exercise);
          return false;
        }
        return true;
      });

      if (validExercises.length === 0) {
        throw new Error('לא נמצאו תרגילים תקינים לשמירה');
      }

      // הכנת הנתונים בפורמט הנכון לשרת
      const completedExercises = validExercises.map(exercise => {
        // סינון רק סטים שהושלמו עם נתונים תקינים
        const validSets = exercise.sets
          .filter(set => set.completed)
          .map(set => ({
            reps: set.reps || exercise.reps || 0,
            weight: set.weight || exercise.weight || 0,
            completed: true
          }));

        if (validSets.length === 0) {
          console.warn('No completed sets for exercise:', exercise.name);
        }

        return {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          sets: validSets
        };
      });

      console.log('Sending completed workout data:', {
        exercises: completedExercises
      });

      const completedWorkout = await completedWorkoutService.completeWorkout(workoutId, {
        exercises: completedExercises,
        endTime: new Date().toISOString()
      });

      console.log('Workout completed successfully:', completedWorkout);
      alert('כל הכבוד! סיימת את האימון בהצלחה!');
      navigate('/user-panel');
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('אירעה שגיאה בשמירת האימון: ' + error.message);
    }
  };

  const navigateToWorkoutUpdate = () => {
    navigate(`/workout-update/${workoutId}`);
  };

  const startWorkout = () => {
    setIsWorkoutStarted(true);
    workoutTimerRef.current = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);

    // Announce first exercise
    announceNextExercise(0);
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

        {/* Rest Timer and Controls - Sticky at bottom */}
        <div className="rest-timer-container sticky bottom-0 z-50 bg-white/90 backdrop-blur-sm shadow-md border-t border-gray-200 py-3 px-4 w-full">
          <div className="container mx-auto flex flex-col items-center gap-3 max-w-screen-lg">
            {isRestTimerActive && (
              <div className="digital-clock text-4xl sm:text-5xl font-bold text-red-600 w-full text-center" style={{ 
                letterSpacing: "2px",
                textShadow: "0 0 10px rgba(255, 0, 0, 0.3)"
              }}>
                <div className="seconds">{String(restTimer).padStart(2, '0')}</div>
                <div className="milliseconds text-2xl">.{String(restMilliseconds).padStart(2, '0')}</div>
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap justify-center w-full">
              <label className="font-medium text-sm sm:text-base">בחר זמן מנוחה:</label>
              <select 
                value={restDuration} 
                onChange={(e) => setRestDuration(Number(e.target.value))}
                className="px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
