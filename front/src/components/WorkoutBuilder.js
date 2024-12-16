import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGoogleCalendar, addRecurringToGoogleCalendar } from './GoogleCalendar';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import { 
  ExerciseList, 
  workoutTypes, 
  getExerciseMetrics,
  schedulePatterns 
} from './WorkoutBuilderExersis';
import { FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const WorkoutBuilder = () => {
  const navigate = useNavigate();
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutType, setWorkoutType] = useState('gym');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showCustomExerciseModal, setShowCustomExerciseModal] = useState(false);
  const [customExercise, setCustomExercise] = useState({
    name: '',
    type: 'weight',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0,
    defaultTime: 0,
    defaultDistance: 0,
    defaultSpeed: 0,
    defaultIncline: 0
  });
  const [frequency, setFrequency] = useState('one-time');
  const [schedulePattern, setSchedulePattern] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [duration, setDuration] = useState(60);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem('google_access_token', tokenResponse.access_token);
      setIsAuthenticated(true);
    },
    onError: (error) => console.error('Google Calendar login failed:', error)
  });

  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    const tokenExpiry = localStorage.getItem('google_token_expiry');
    if (token && tokenExpiry && new Date(tokenExpiry) > new Date()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSaveWorkout = async () => {
    try {
      if (!isAuthenticated) {
        try {
          await login();
        } catch (error) {
          alert('נא להתחבר תחילה לחשבון Google');
          return;
        }
      }

      if (selectedExercises.length === 0) {
        alert('נא להוסיף לפחות תרגיל אחד לאימון');
        return;
      }

      // Validate exercises data size
      const optimizedExercises = selectedExercises.map(exercise => ({
        name: exercise.name,
        sets: Number(exercise.sets) || 3,
        reps: Number(exercise.reps) || 12,
        weight: Number(exercise.weight) || 0,
        type: exercise.type || 'weight',
        notes: exercise.notes || ''
      }));

      const workoutTitle = `אימון ${workoutTypes.find(t => t.id === workoutType)?.name || ''}`;
      
      // Create a more compact description
      const description = selectedExercises.map(exercise => {
        const metrics = getExerciseMetrics(exercise);
        return `${exercise.name}\n${metrics}`;
      }).join('\n\n');

      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      // Prepare request data
      const requestData = {
        title: workoutTitle,
        description,
        exercises: optimizedExercises,
        startDate: startDateTime,
        endDate: endDateTime,
        duration,
        frequency,
        schedulePattern
      };

      // Validate request size
      const requestSize = new Blob([JSON.stringify(requestData)]).size;
      if (requestSize > 5000000) { // 5MB limit
        throw new Error('האימון גדול מדי. נא להפחית את מספר התרגילים או את כמות הטקסט בהערות.');
      }

      try {
        if (frequency === 'one-time') {
          await addToGoogleCalendar({
            summary: workoutTitle,
            description,
            startDateTime,
            endDateTime
          });
        } else {
          if (!schedulePattern) {
            alert('נא לבחור תדירות לאימון הקבוע');
            return;
          }

          const recurrenceRule = getRecurrenceRule(schedulePattern);
          if (!recurrenceRule) {
            alert('שגיאה ביצירת תבנית החזרה');
            return;
          }

          await addRecurringToGoogleCalendar({
            summary: workoutTitle,
            description,
            startDateTime,
            endDateTime,
            recurrence: [recurrenceRule]
          });
        }

        // Save to server with proper error handling
        const token = authService.getToken();
        if (!token) {
          console.error('No auth token found');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3000/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'שגיאה בשמירת האימון');
        }

        alert(frequency === 'one-time' ? 'האימון נוסף בהצלחה!' : 'האימון הקבוע נוסף בהצלחה!');
        navigate(-1);
      } catch (error) {
        if (error.message.includes('Token expired') || error.message.includes('נדרשת התחברות מחדש')) {
          setIsAuthenticated(false);
          alert('נא להתחבר מחדש לחשבון Google');
          login();
        } else {
          console.error('Error saving workout:', error);
          alert('אירעה שגיאה בשמירת האימון: ' + error.message);
        }
      }
    } catch (error) {
      console.error('Error in handleSaveWorkout:', error);
      alert('אירעה שגיאה בשמירת האימון: ' + error.message);
    }
  };

  const addExercise = (exercise) => {
    const newExercise = {
      id: Date.now(), // Add unique ID for each exercise
      name: exercise.name,
      type: exercise.type,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weight: exercise.defaultWeight || 0,
      distance: exercise.defaultDistance || 0,
      speed: exercise.defaultSpeed || 0,
      time: exercise.defaultTime || 0,
      incline: exercise.defaultIncline || 0
    };
    setSelectedExercises(prevExercises => [...prevExercises, newExercise]);
  };

  const updateExercise = (exerciseId, field, value) => {
    setSelectedExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, [field]: value }
          : exercise
      )
    );
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises(prevExercises =>
      prevExercises.filter(exercise => exercise.id !== exerciseId)
    );
  };

  const moveExerciseUp = (index) => {
    if (index === 0) return;
    setSelectedExercises(prevExercises => {
      const newExercises = [...prevExercises];
      [newExercises[index], newExercises[index - 1]] = 
      [newExercises[index - 1], newExercises[index]];
      return newExercises;
    });
  };

  const moveExerciseDown = (index) => {
    if (index === selectedExercises.length - 1) return;
    setSelectedExercises(prevExercises => {
      const newExercises = [...prevExercises];
      [newExercises[index], newExercises[index + 1]] = 
      [newExercises[index + 1], newExercises[index]];
      return newExercises;
    });
  };

  const getRecurrenceRule = (pattern) => {
    switch (pattern) {
      case 'daily':
        return 'RRULE:FREQ=DAILY';
      case 'alternate':
        return 'RRULE:FREQ=DAILY;INTERVAL=2';
      case 'twoday':
        return 'RRULE:FREQ=DAILY;INTERVAL=3';
      case 'ab':
        return 'RRULE:FREQ=DAILY;INTERVAL=3';
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20" dir="rtl">
      {!isAuthenticated && (
        <button
          onClick={() => login()}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          התחבר עם Google
        </button>
      )}
      
      <div className="space-y-6 text-right">
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-right">תדירות האימון</h3>
          <div className="flex flex-row-reverse gap-4">
            <button
              className={`px-6 py-2 rounded-full ${
                frequency === 'recurring'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFrequency('recurring')}
            >
              קבוע
            </button>
            <button
              className={`px-6 py-2 rounded-full ${
                frequency === 'one-time'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => {
                setFrequency('one-time');
                setSchedulePattern('');
              }}
            >
              חד פעמי
            </button>
          </div>

          {frequency === 'recurring' && (
            <div className="mt-4">
              <select
                value={schedulePattern}
                onChange={(e) => setSchedulePattern(e.target.value)}
                className="w-full p-2 border rounded-md text-right"
                dir="rtl"
              >
                <option value="">בחר תדירות</option>
                {Object.entries(schedulePatterns).map(([key, pattern]) => (
                  <option key={key} value={key}>
                    {pattern.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">סוג אימון</h2>
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="w-full p-2 border rounded-md text-right"
            dir="rtl"
          >
            {workoutTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">תרגילים</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowExerciseModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              הוסף תרגיל
            </button>
            <button
              onClick={() => setShowCustomExerciseModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              צור תרגיל חדש
            </button>
          </div>

          {showCustomExerciseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">יצירת תרגיל חדש</h2>
                  <button
                    onClick={() => setShowCustomExerciseModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    סגור
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם התרגיל
                    </label>
                    <input
                      type="text"
                      value={customExercise.name}
                      onChange={(e) =>
                        setCustomExercise({ ...customExercise, name: e.target.value })
                      }
                      className="w-full p-2 border rounded text-right"
                      dir="rtl"
                      placeholder="הכנס שם תרגיל"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      סוג תרגיל
                    </label>
                    <select
                      value={customExercise.type}
                      onChange={(e) =>
                        setCustomExercise({ ...customExercise, type: e.target.value })
                      }
                      className="w-full p-2 border rounded text-right"
                      dir="rtl"
                    >
                      <option value="weight">משקל</option>
                      <option value="bodyweight">משקל גוף</option>
                      <option value="running">ריצה</option>
                    </select>
                  </div>
                  
                  {customExercise.type === 'weight' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          סטים
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultSets}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultSets: parseInt(e.target.value)
                            })
                          }
                          min="1"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          חזרות
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultReps}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultReps: parseInt(e.target.value)
                            })
                          }
                          min="1"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          משקל התחלתי (ק"ג)
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultWeight}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultWeight: parseFloat(e.target.value)
                            })
                          }
                          min="0"
                          step="0.5"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                    </>
                  )}

                  {customExercise.type === 'bodyweight' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          סטים
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultSets}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultSets: parseInt(e.target.value)
                            })
                          }
                          min="1"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          חזרות
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultReps}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultReps: parseInt(e.target.value)
                            })
                          }
                          min="1"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                    </>
                  )}

                  {customExercise.type === 'running' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          מרחק (ק"מ)
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultDistance}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultDistance: parseFloat(e.target.value)
                            })
                          }
                          min="0.1"
                          step="0.1"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          מהירות (קמ"ש)
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultSpeed}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultSpeed: parseFloat(e.target.value)
                            })
                          }
                          min="1"
                          step="0.5"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          שיפוע (%)
                        </label>
                        <input
                          type="number"
                          value={customExercise.defaultIncline}
                          onChange={(e) =>
                            setCustomExercise({
                              ...customExercise,
                              defaultIncline: parseInt(e.target.value)
                            })
                          }
                          min="0"
                          max="15"
                          className="w-full p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        if (!customExercise.name) {
                          alert('נא להזין שם תרגיל');
                          return;
                        }
                        addExercise(customExercise);
                        setShowCustomExerciseModal(false);
                        setCustomExercise({
                          name: '',
                          type: 'weight',
                          defaultSets: 3,
                          defaultReps: 12,
                          defaultWeight: 0,
                          defaultTime: 0,
                          defaultDistance: 0,
                          defaultSpeed: 0,
                          defaultIncline: 0
                        });
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      הוסף תרגיל
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showExerciseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto text-right">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">בחר תרגיל</h2>
                  <button
                    onClick={() => setShowExerciseModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    סגור
                  </button>
                </div>
                <ExerciseList
                  workoutType={workoutType}
                  onSelectExercise={(exercise) => {
                    addExercise(exercise);
                    setShowExerciseModal(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <FaTrash className="text-xl md:text-2xl" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveExerciseUp(index)}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50 p-2"
                      >
                        <FaChevronUp className="text-xl md:text-2xl" />
                      </button>
                      <button
                        onClick={() => moveExerciseDown(index)}
                        disabled={index === selectedExercises.length - 1}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50 p-2"
                      >
                        <FaChevronDown className="text-xl md:text-2xl" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-end">
                  {exercise.type === 'running' ? (
                    <>
                      <div className="flex flex-col items-end">
                        <label className="text-sm text-gray-600 mb-1">מרחק (ק"מ)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={exercise.distance || ''}
                          onChange={(e) => updateExercise(exercise.id, 'distance', parseFloat(e.target.value))}
                          className="w-24 p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="text-sm text-gray-600 mb-1">מהירות (קמ"ש)</label>
                        <input
                          type="number"
                          min="1"
                          step="0.5"
                          value={exercise.speed || ''}
                          onChange={(e) => updateExercise(exercise.id, 'speed', parseFloat(e.target.value))}
                          className="w-24 p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="text-sm text-gray-600 mb-1">שיפוע (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={exercise.incline || ''}
                          onChange={(e) => updateExercise(exercise.id, 'incline', parseInt(e.target.value))}
                          className="w-24 p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-end">
                        <label className="text-sm text-gray-600 mb-1">סטים</label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets || ''}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                          className="w-24 p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="text-sm text-gray-600 mb-1">חזרות</label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps || ''}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                          className="w-24 p-2 border rounded text-right"
                          dir="rtl"
                        />
                      </div>
                      {exercise.type === 'weight' && (
                        <div className="flex flex-col items-end">
                          <label className="text-sm text-gray-600 mb-1">משקל (ק"ג)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={exercise.weight || ''}
                            onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value))}
                            className="w-24 p-2 border rounded text-right"
                            dir="rtl"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">תאריך</h2>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
                setSelectedTime(
                  new Date().toLocaleTimeString('he-IL', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                  })
                );
              }}
              className="w-full p-2 border rounded text-right"
              dir="rtl"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">שעה</h2>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">משך האימון (בדקות)</h2>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
            className="w-full p-2 border rounded text-right"
            dir="rtl"
          />
        </div>

        <button
          onClick={handleSaveWorkout}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          שמור אימון
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
