import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const exerciseLibrary = {
  gym: {
    chest: [
      { id: 'bench_press', name: 'לחיצת חזה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'incline_press', name: 'לחיצת חזה בשיפוע', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'decline_press', name: 'לחיצת חזה במדרון שלילי', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'dumbbell_flyes', name: 'פרפר עם משקולות', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'cable_flyes', name: 'פרפר בכבלים', defaultSets: 3, defaultReps: 12, type: 'weight' }
    ],
    back: [
      { id: 'deadlift', name: 'דדליפט', defaultSets: 4, defaultReps: 8, type: 'weight' },
      { id: 'lat_pulldown', name: 'מתח לחזה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'rows', name: 'חתירה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'pull_ups', name: 'מתח', defaultSets: 4, defaultReps: 8, type: 'weight' },
      { id: 't_bar_rows', name: 'חתירת T בר', defaultSets: 3, defaultReps: 10, type: 'weight' },
      { id: 'seated_cable_rows', name: 'חתירה בישיבה בכבלים', defaultSets: 3, defaultReps: 12, type: 'weight' }
    ],
    shoulders: [
      { id: 'shoulder_press', name: 'לחיצת כתפיים', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'lateral_raises', name: 'הרמות צד', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'front_raises', name: 'הרמות קדמיות', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'reverse_flyes', name: 'פרפר אחורי', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'arnold_press', name: 'לחיצת ארנולד', defaultSets: 3, defaultReps: 10, type: 'weight' }
    ],
    legs: [
      { id: 'squats', name: 'סקוואטים', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'leg_press', name: 'לחיצת רגליים', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'lunges', name: 'פסיעות', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'leg_extensions', name: 'הרחבות רגליים', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'leg_curls', name: 'כיפופי רגליים', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'calf_raises', name: 'העלאות עקב', defaultSets: 4, defaultReps: 15, type: 'weight' }
    ],
    arms: [
      { id: 'bicep_curls', name: 'כפיפות קיבורת', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'tricep_extensions', name: 'הרחבות טריצפס', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'hammer_curls', name: 'כפיפות פטיש', defaultSets: 3, defaultReps: 10, type: 'weight' },
      { id: 'preacher_curls', name: 'כפיפות מטיף', defaultSets: 3, defaultReps: 10, type: 'weight' },
      { id: 'skull_crushers', name: 'מרפקי גולגולת', defaultSets: 3, defaultReps: 10, type: 'weight' }
    ],
    abs: [
      { id: 'crunches', name: 'קרנצ׳ים', defaultSets: 3, defaultReps: 15, type: 'bodyweight' },
      { id: 'russian_twists', name: 'סיבובים רוסיים', defaultSets: 3, defaultReps: 20, type: 'bodyweight' },
      { id: 'leg_raises', name: 'הרמות רגליים', defaultSets: 3, defaultReps: 15, type: 'bodyweight' },
      { id: 'plank', name: 'פלאנק', defaultSets: 3, defaultTime: 60, type: 'time' }
    ]
  },
  calisthenics: {
    upper: [
      { id: 'pushups', name: 'שכיבות סמיכה', defaultSets: 4, defaultReps: 15, type: 'bodyweight' },
      { id: 'pullups', name: 'מתח', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'dips', name: 'דיפים', defaultSets: 3, defaultReps: 12, type: 'bodyweight' },
      { id: 'diamond_pushups', name: 'שכיבות סמיכה יהלום', defaultSets: 3, defaultReps: 10, type: 'bodyweight' },
      { id: 'chin_ups', name: 'מתח בכיוון פנים', defaultSets: 3, defaultReps: 8, type: 'bodyweight' }
    ],
    core: [
      { id: 'plank', name: 'פלאנק', defaultSets: 3, defaultTime: 60, type: 'time' },
      { id: 'leg_raises', name: 'הרמות רגליים', defaultSets: 3, defaultReps: 15, type: 'bodyweight' },
      { id: 'mountain_climbers', name: 'מטפסי הרים', defaultSets: 3, defaultReps: 20, type: 'bodyweight' },
      { id: 'bicycle_crunches', name: 'קרנצ׳ים אופניים', defaultSets: 3, defaultReps: 20, type: 'bodyweight' }
    ],
    lower: [
      { id: 'bodyweight_squats', name: 'סקוואטים ללא משקולות', defaultSets: 4, defaultReps: 15, type: 'bodyweight' },
      { id: 'lunges', name: 'פסיעות', defaultSets: 3, defaultReps: 12, type: 'bodyweight' },
      { id: 'jump_squats', name: 'סקוואטים קופצניים', defaultSets: 3, defaultReps: 15, type: 'bodyweight' }
    ]
  },
  running: {
    outdoor: [
      { id: 'distance_run', name: 'ריצת מרחק', defaultSets: 1, defaultDistance: 5, type: 'running' },
      { id: 'sprint_intervals', name: 'אינטרוולים', defaultSets: 8, defaultDistance: 0.4, type: 'running' },
      { id: 'tempo_run', name: 'ריצת טמפו', defaultSets: 1, defaultDistance: 3, type: 'running' },
      { id: 'hill_run', name: 'ריצת עליות', defaultSets: 5, defaultDistance: 0.5, type: 'running' }
    ],
    treadmill: [
      { id: 'steady_state_cardio', name: 'קרדיו בקצב קבוע', defaultSets: 1, defaultTime: 30, type: 'time' },
      { id: 'incline_treadmill', name: 'ריצה בעליה', defaultSets: 1, defaultTime: 20, type: 'time' },
      { id: 'high_intensity_intervals', name: 'אינטרוולים עתירי עצימות', defaultSets: 6, defaultTime: 3, type: 'time' }
    ]
  },
  other: {
    custom: [
      { id: 'custom_cardio', name: 'אימון קרדיו מותאם אישית', defaultSets: 1, type: 'time', defaultTime: 30 },
      { id: 'custom_strength', name: 'אימון כוח מותאם אישית', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'custom_flexibility', name: 'אימון גמישות', defaultSets: 3, defaultTime: 30, type: 'time' },
      { id: 'yoga', name: 'יוגה', defaultSets: 1, defaultTime: 60, type: 'time' },
      { id: 'pilates', name: 'פילאטיס', defaultSets: 1, defaultTime: 45, type: 'time' }
    ]
  }
};

const workoutTypes = [
  { id: 'gym', name: 'אימון כוח בחדר כושר' },
  { id: 'calisthenics', name: 'קליסטניקס' },
  { id: 'running', name: 'ריצה' },
  { id: 'other', name: 'אימון אחר' }
];

const getExerciseMetrics = (exercise) => {
  switch (exercise.type) {
    case 'weight':
      return { metric: 'ק"ג', reps: true };
    case 'bodyweight':
      return { metric: 'חזרות', reps: true };
    case 'running':
      return { metric: 'ק"מ', distance: true, speed: true };
    case 'time':
      return { metric: 'דקות', time: true };
    default:
      return { metric: 'חזרות', reps: true };
  }
};

const getCategoryName = (category) => {
  const categories = {
    chest: 'חזה',
    back: 'גב',
    shoulders: 'כתפיים',
    legs: 'רגליים',
    arms: 'ידיים',
    abs: 'בטן',
    upper: 'פלג גוף עליון',
    core: 'ליבה',
    lower: 'פלג גוף תחתון',
    sprint: 'ספרינטים',
    endurance: 'סיבולת',
    intervals: 'אינטרוולים',
    outdoor: 'אימון חוץ',
    custom: 'אימון מותאם אישית'
  };
  return categories[category] || category;
};

const ExerciseList = ({ workoutType, onSelectExercise }) => {
  const exercises = exerciseLibrary[workoutType] || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(exercises).map(([category, categoryExercises]) => (
        <div key={category} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{getCategoryName(category)}</h3>
          <div className="space-y-2">
            {categoryExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-2 hover:bg-gray-50 cursor-pointer rounded"
                onClick={() => onSelectExercise(exercise)}
              >
                <div>
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">
                    {getExerciseMetrics(exercise).metric} - {exercise.defaultSets} סטים
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ExerciseDetails = ({ exercise, onRemove, onUpdateDetails }) => {
  const metrics = getExerciseMetrics(exercise);
  const [localDetails, setLocalDetails] = useState({
    sets: exercise.sets || exercise.defaultSets || 3,
    reps: exercise.reps || exercise.defaultReps,
    weight: exercise.weight,
    time: exercise.time || exercise.defaultTime,
    distance: exercise.distance,
    speed: exercise.speed
  });

  const handleDetailChange = (field, value) => {
    const updatedDetails = { ...localDetails, [field]: value };
    setLocalDetails(updatedDetails);
    onUpdateDetails(exercise.id, updatedDetails);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-2 flex justify-between items-center">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">{exercise.name}</h4>
          <button 
            onClick={() => onRemove(exercise.id)} 
            className="text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metrics.reps && (
            <div>
              <label className="block text-sm font-medium text-gray-700">סטים</label>
              <input
                type="number"
                value={localDetails.sets}
                onChange={(e) => handleDetailChange('sets', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}
          {metrics.reps && (
            <div>
              <label className="block text-sm font-medium text-gray-700">חזרות</label>
              <input
                type="number"
                value={localDetails.reps}
                onChange={(e) => handleDetailChange('reps', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}
          {metrics.metric === 'ק"ג' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">משקל (ק"ג)</label>
              <input
                type="number"
                value={localDetails.weight}
                onChange={(e) => handleDetailChange('weight', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}
          {metrics.time && (
            <div>
              <label className="block text-sm font-medium text-gray-700">זמן (דקות)</label>
              <input
                type="number"
                value={localDetails.time}
                onChange={(e) => handleDetailChange('time', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}
          {metrics.distance && (
            <div>
              <label className="block text-sm font-medium text-gray-700">מרחק (ק"מ)</label>
              <input
                type="number"
                value={localDetails.distance}
                onChange={(e) => handleDetailChange('distance', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExerciseSelectionModal = ({ workoutType, onClose, onSelectExercise }) => {
  const exercises = exerciseLibrary[workoutType] || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">בחר תרגיל</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(exercises).map(([category, categoryExercises]) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">{getCategoryName(category)}</h3>
              <div className="space-y-2">
                {categoryExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer rounded flex justify-between items-center"
                    onClick={() => {
                      onSelectExercise(exercise);
                      onClose();
                    }}
                  >
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {getExerciseMetrics(exercise).metric} - {exercise.defaultSets} סטים
                      </p>
                    </div>
                    <button 
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      הוסף
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkoutUpdate = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('gym');
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'שגיאה בקבלת האימון');
        }

        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setWorkout(result.data);
          setExercises(result.data.exercises || []);
        } else {
          throw new Error('מבנה נתונים לא תקין');
        }
      } catch (error) {
        console.error('Error fetching workout details:', error);
        setError(error.message || 'לא ניתן לטעון את פרטי האימון כרגע. אנא נסה שוב מאוחר יותר.');
      }
    };

    fetchWorkoutDetails();
  }, [workoutId, navigate]);

  const handleWorkoutUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // חישוב משך האימון
      const startDate = new Date(workout.startDate);
      const endDate = new Date(workout.endDate);
      const durationInMinutes = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60)));

      // הכנת נתוני התרגילים
      const preparedExercises = exercises.map((exercise, index) => {
        // וידוא שיש את כל השדות הנדרשים
        if (!exercise.name) {
          throw new Error(`תרגיל ${index + 1} חסר שם`);
        }

        // המרת ערכים למספרים ווידוא ערכים מינימליים
        const sets = Math.max(1, Number(exercise.sets) || 3);
        const reps = Math.max(1, Number(exercise.reps) || 10);
        const weight = Math.max(0, Number(exercise.weight) || 0);

        return {
          id: exercise.id || `temp_${index}`,
          name: String(exercise.name),
          sets,
          reps,
          weight,
          notes: String(exercise.notes || '')
        };
      });

      if (preparedExercises.length === 0) {
        throw new Error('יש להוסיף לפחות תרגיל אחד לאימון');
      }

      // הכנת גוף הבקשה
      const requestBody = {
        title: String(workout.title || '').trim(),
        description: String(workout.description || '').trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: durationInMinutes,
        exercises: preparedExercises
      };

      // וידוא שדות חובה
      if (!requestBody.title) {
        throw new Error('שם האימון הוא שדה חובה');
      }

      // הדפסת גוף הבקשה לצורך ניפוי באגים
      console.log('Workout Update Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE_URL}/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      
      // הדפסת תגובת השרת לצורך ניפוי באגים
      console.log('Server Response:', {
        status: response.status,
        body: responseData
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        
        throw new Error(responseData.message || responseData.details || 'שגיאה בעדכון האימון');
      }

      // הפניה חזרה לדף תוכנית האימונים לאחר עדכון מוצלח
      navigate('/user-panel');
    } catch (error) {
      console.error('Full Error in Workout Update:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        requestData: {
          workoutId,
          exercises: exercises.length,
          title: workout?.title
        }
      });

      setError(error.message || 'לא ניתן לעדכן את האימון כרגע. אנא נסה שוב מאוחר יותר.');
    }
  };

  const addExercise = () => {
    setExercises([...exercises, { 
      name: '', 
      sets: 0, 
      reps: 0, 
      weight: 0 
    }]);
  };

  const removeExercise = (indexToRemove) => {
    const newExercises = exercises.filter((_, index) => index !== indexToRemove);
    setExercises(newExercises);
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExerciseToWorkout = (exercise) => {
    if (exercises.some(e => e.id === exercise.id)) {
      alert('תרגיל זה כבר נוסף לאימון');
      return;
    }

    const newExercise = {
      ...exercise,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps,
      weight: exercise.type === 'weight' ? 0 : undefined,
      time: exercise.defaultTime,
      distance: exercise.defaultDistance
    };

    setExercises([...exercises, newExercise]);
  };

  const updateExerciseDetails = (exerciseId, details) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return { ...exercise, ...details };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!workout) {
    return <div>טוען פרטי אימון...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">עדכון אימון: {workout.title}</h1>
      
      <form onSubmit={handleWorkoutUpdate} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            שם האימון
            <input
              type="text"
              value={workout.title}
              onChange={(e) => setWorkout({...workout, title: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            תיאור האימון
            <textarea
              value={workout.description}
              onChange={(e) => setWorkout({...workout, description: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </label>
        </div>

        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              תאריך התחלה
              <input
                type="date"
                value={workout.startDate ? workout.startDate.split('T')[0] : ''}
                onChange={(e) => setWorkout({...workout, startDate: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              תאריך סיום
              <input
                type="date"
                value={workout.endDate ? workout.endDate.split('T')[0] : ''}
                onChange={(e) => setWorkout({...workout, endDate: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">תרגילים</h2>
          {exercises.map((exercise, index) => (
            <ExerciseDetails 
              key={index} 
              exercise={exercise} 
              onRemove={() => removeExercise(index)} 
              onUpdateDetails={updateExerciseDetails} 
            />
          ))}
          <button
            type="button"
            onClick={() => setShowExerciseModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
          >
            הוסף תרגיל
          </button>
          {showExerciseModal && (
            <ExerciseSelectionModal 
              workoutType={selectedWorkoutType} 
              onClose={() => setShowExerciseModal(false)} 
              onSelectExercise={addExerciseToWorkout} 
            />
          )}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            סוג אימון
            <select
              value={selectedWorkoutType}
              onChange={(e) => setSelectedWorkoutType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {workoutTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            שמור שינויים
          </button>
          <button
            type="button"
            onClick={() => navigate('/user-panel')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            בטל
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutUpdate;
