import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGoogleCalendar, addRecurringToGoogleCalendar } from './GoogleCalendar';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';

// נתונים סטטיים לדוגמה - בהמשך אפשר להעביר למסד נתונים
const exerciseLibrary = {
  gym: {
    chest: [
      { id: 'bench_press', name: 'לחיצת חזה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'incline_press', name: 'לחיצת חזה בשיפוע', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'decline_press', name: 'לחיצת חזה במדרון שלילי', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'dumbbell_flyes', name: 'פרפר עם משקולות', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'cable_flyes', name: 'פרפר בכבלים', defaultSets: 3, defaultReps: 15, type: 'weight' }
    ],
    back: [
      { id: 'deadlift', name: 'דדליפט', defaultSets: 4, defaultReps: 8, type: 'weight' },
      { id: 'lat_pulldown', name: 'מתח לחזה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'rows', name: 'חתירה', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'tbar_rows', name: 'חתירת T', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'pull_ups', name: 'מתח', defaultSets: 4, defaultReps: 8, type: 'weight' }
    ],
    shoulders: [
      { id: 'military_press', name: 'לחיצת כתפיים', defaultSets: 4, defaultReps: 10, type: 'weight' },
      { id: 'lateral_raises', name: 'הרמות צד', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'front_raises', name: 'הרמות קדמיות', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'reverse_flyes', name: 'פרפר אחורי', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'shrugs', name: 'משיכות כתפיים', defaultSets: 4, defaultReps: 12, type: 'weight' }
    ],
    legs: [
      { id: 'squats', name: 'סקוואט', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'leg_press', name: 'לחיצת רגליים', defaultSets: 4, defaultReps: 15, type: 'weight' },
      { id: 'lunges', name: 'לאנג׳ים', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'leg_extensions', name: 'פשיטת ברך', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'leg_curls', name: 'כפיפת ברך', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'calf_raises', name: 'כפות רגליים', defaultSets: 4, defaultReps: 20, type: 'weight' }
    ],
    arms: [
      { id: 'bicep_curls', name: 'כפיפות מרפק', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'hammer_curls', name: 'כפיפות פטיש', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'tricep_pushdown', name: 'לחיצות טרייספס', defaultSets: 4, defaultReps: 12, type: 'weight' },
      { id: 'tricep_extension', name: 'הרחקות טרייספס', defaultSets: 3, defaultReps: 12, type: 'weight' },
      { id: 'preacher_curls', name: 'כפיפות על ספסל', defaultSets: 3, defaultReps: 12, type: 'weight' }
    ],
    abs: [
      { id: 'crunches', name: 'כפיפות בטן', defaultSets: 3, defaultReps: 20, type: 'weight' },
      { id: 'leg_raises', name: 'הרמות רגליים', defaultSets: 3, defaultReps: 15, type: 'weight' },
      { id: 'russian_twists', name: 'טוויסט רוסי', defaultSets: 3, defaultReps: 20, type: 'weight' },
      { id: 'planks', name: 'פלאנק', defaultSets: 3, defaultTime: 60, type: 'time' },
      { id: 'cable_crunches', name: 'כפיפות בטן בכבל', defaultSets: 3, defaultReps: 15, type: 'weight' }
    ],
    cardio: [
      { id: 'treadmill', name: 'הליכון', defaultSets: 1, type: 'running', defaultDistance: 5, defaultSpeed: 10 },
      { id: 'stairmaster', name: 'מדרגות', defaultSets: 1, type: 'time', defaultTime: 20 },
      { id: 'elliptical', name: 'אליפטיקל', defaultSets: 1, type: 'time', defaultTime: 30 },
      { id: 'bike', name: 'אופניים', defaultSets: 1, type: 'time', defaultTime: 30 }
    ]
  },
  calisthenics: {
    upper: [
      { id: 'pushups', name: 'שכיבות סמיכה', defaultSets: 4, defaultReps: 15, type: 'bodyweight' },
      { id: 'pullups', name: 'מתח', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'dips', name: 'דיפים', defaultSets: 3, defaultReps: 12, type: 'bodyweight' },
      { id: 'diamond_pushups', name: 'שכיבות סמיכה יהלום', defaultSets: 3, defaultReps: 12, type: 'bodyweight' },
      { id: 'pike_pushups', name: 'שכיבות סמיכה פייק', defaultSets: 3, defaultReps: 10, type: 'bodyweight' },
      { id: 'archer_pushups', name: 'שכיבות סמיכה קשת', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'handstand', name: 'עמידת ידיים', defaultSets: 3, defaultTime: 30, type: 'time' }
    ],
    core: [
      { id: 'plank', name: 'פלאנק', defaultSets: 3, defaultTime: 60, type: 'time' },
      { id: 'l_sit', name: 'ישיבת L', defaultSets: 3, defaultTime: 30, type: 'time' },
      { id: 'hanging_leg_raises', name: 'הרמת רגליים בתלייה', defaultSets: 3, defaultReps: 12, type: 'bodyweight' },
      { id: 'dragon_flag', name: 'דגל דרקון', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'hollow_body', name: 'הולו בודי', defaultSets: 3, defaultTime: 45, type: 'time' },
      { id: 'windshield_wipers', name: 'מגבים', defaultSets: 3, defaultReps: 10, type: 'bodyweight' }
    ],
    lower: [
      { id: 'pistol_squats', name: 'סקוואט על רגל אחת', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'jump_squats', name: 'סקוואט קפיצה', defaultSets: 4, defaultReps: 15, type: 'bodyweight' },
      { id: 'burpees', name: 'בארפי', defaultSets: 3, defaultReps: 10, type: 'bodyweight' },
      { id: 'shrimp_squats', name: 'סקוואט שרימפ', defaultSets: 3, defaultReps: 8, type: 'bodyweight' },
      { id: 'box_jumps', name: 'קפיצות על קופסה', defaultSets: 3, defaultReps: 10, type: 'bodyweight' },
      { id: 'wall_sit', name: 'ישיבה על קיר', defaultSets: 3, defaultTime: 60, type: 'time' }
    ]
  },
  running: {
    outdoor: [
      { id: 'distance_run', name: 'ריצת מרחק', type: 'running', defaultDistance: 5, defaultSpeed: 10 },
      { id: 'sprint_intervals', name: 'אינטרוולים', type: 'running', defaultSets: 8, defaultDistance: 0.4, defaultSpeed: 15 },
      { id: 'hill_run', name: 'ריצת עליות', type: 'running', defaultDistance: 3, defaultSpeed: 8 }
    ],
    indoor: [
      { id: 'treadmill_run', name: 'ריצה על הליכון', type: 'running', defaultDistance: 5, defaultSpeed: 10 },
      { id: 'treadmill_intervals', name: 'אינטרוולים על הליכון', type: 'running', defaultSets: 8, defaultDistance: 0.4, defaultSpeed: 15 },
      { id: 'incline_run', name: 'ריצה בשיפוע', type: 'running', defaultDistance: 3, defaultSpeed: 8, defaultIncline: 5 }
    ]
  }
};

const workoutTypes = [
  { id: 'gym', name: 'אימון כוח בחדר כושר' },
  { id: 'calisthenics', name: 'קליסטניקס' },
  { id: 'running', name: 'ריצה' }
];

const schedulePatterns = [
  { id: 'daily', name: 'כל יום', days: 1, rest: 0 },
  { id: 'alternate', name: 'יום כן יום לא', days: 1, rest: 1 },
  { id: 'twoday', name: 'יומיים אימון יום מנוחה', days: 2, rest: 1 },
  { id: 'ab', name: 'אימון A אימון B מנוחה', days: 2, rest: 1, split: true },
  { id: 'custom', name: 'התאמה אישית', days: 0, rest: 0 }
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
    intervals: 'אינטרוולים'
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

const WorkoutBuilder = () => {
  const navigate = useNavigate();
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutType, setWorkoutType] = useState('gym');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [frequency, setFrequency] = useState('one-time');
  const [schedulePattern, setSchedulePattern] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // בדיקת התחברות בטעינה
  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem('google_access_token', tokenResponse.access_token);
      setIsAuthenticated(true);
    },
    onError: () => {
      alert('ההתחברות נכשלה. נא לנסות שוב.');
    },
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  const handleSaveWorkout = async () => {
    try {

      if (!isAuthenticated) {
        alert('נא להתחבר תחילה לחשבון Google');
        login();
        return;
      }

      if (selectedExercises.length === 0) {
        alert('נא להוסיף לפחות תרגיל אחד לאימון');
        return;
      }

      const workoutTitle = `אימון ${workoutTypes.find(t => t.id === workoutType)?.name || ''}`;
      const description = selectedExercises.map(exercise => {
        const metrics = getExerciseMetrics(exercise);
        return `${exercise.name}\n${metrics}`;
      }).join('\n\n');
      selectedExercises.forEach(exercises => {
        exercises["id"] = exercises["id"];
        delete exercises["id"];
      });

      if (frequency === 'one-time') {
        // אימון חד פעמי
        const startDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        startDateTime.setHours(parseInt(hours), parseInt(minutes));

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        await addToGoogleCalendar({
          summary: workoutTitle,
          description,
          startDateTime,
          endDateTime
        });


        // שמירת האימון בשרת
        try {
          await fetch('http://localhost:3000/api/workouts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({
              title: workoutTitle,
              description,
              exercises: selectedExercises,
              startDate: startDateTime,
              endDate: endDateTime,
              duration
            })
          });
        } catch (error) {
          console.error('Error saving workout to server:', error);
          alert('אירעה שגיאה בשמירת האימון בשרת');
          return;

        }
        alert('האימון נוסף בהצלחה ליומן גוגל ולשרת!');
        navigate(-1);
      } else {
        // אימון קבוע
        if (!schedulePattern) {
          alert('נא לבחור תדירות לאימון הקבוע');
          return;
        }

        const recurrenceRule = getRecurrenceRule(schedulePattern);
        if (!recurrenceRule) {
          alert('שגיאה ביצירת תבנית החזרה');
          return;
        }





        const startDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        startDateTime.setHours(parseInt(hours), parseInt(minutes));

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        await addRecurringToGoogleCalendar({
          summary: workoutTitle,
          description,
          startDateTime,
          endDateTime,
          recurrence: [recurrenceRule]
        });

        

        // שמירת האימון הקבוע בשרת
        try {
          await fetch('/api/workouts/recurring', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({
              title: workoutTitle,
              description,
              exercises: selectedExercises,
              startDate: startDateTime,
              endDate: endDateTime,
              duration,
              recurrence: recurrenceRule
            })
          });
        } catch (error) {
          console.error('Error saving recurring workout to server:', error);
          alert('אירעה שגיאה בשמירת האימון הקבוע בשרת');
          return;
        }
        alert('האימון הקבוע נוסף בהצלחה ליומן גוגל!');
        navigate(-1);
      }

      // איפוס הטופס
      setSelectedExercises([]);
      setWorkoutType('gym');
      setFrequency('one-time');
      setSchedulePattern('');
      setSelectedDate(new Date());
      setSelectedTime('09:00');
      setDuration(60);
    } catch (error) {
      console.error('Error saving workout:', error);
      if (error.message.includes('No access token') || error.message.includes('אנא התחבר')) {
        alert('נא להתחבר מחדש לחשבון Google');
        setIsAuthenticated(false);
        login();
      } else {
        alert('אירעה שגיאה בשמירת האימון ליומן גוגל');
      }
    }
  };

  const addExercise = (exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        name: exercise.name,
        type: exercise.type,
        sets: exercise.defaultSets,
        reps: exercise.defaultReps,
        weight: 0,
        distance: exercise.defaultDistance || 0,
        speed: exercise.defaultSpeed || 0,
        time: exercise.defaultTime || 0,
        incline: exercise.defaultIncline || 0,
        completed: false
      }
    ]);
  };

  const updateExercise = (id, field, value) => {
    setSelectedExercises(
      selectedExercises.map(exercise =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const toggleExerciseCompletion = (id) => {
    setSelectedExercises(
      selectedExercises.map(exercise =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const removeExercise = (id) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const moveExerciseUp = (index) => {
    if (index === 0) return;
    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    setSelectedExercises(newExercises);
  };

  const moveExerciseDown = (index) => {
    if (index === selectedExercises.length - 1) return;
    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    setSelectedExercises(newExercises);
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
        return 'RRULE:FREQ=DAILY;INTERVAL=3'; // A, B, rest pattern
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-yellow-700">יש להתחבר לחשבון Google כדי לשמור אימונים ביומן</p>
            <button
              onClick={() => login()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              התחבר עם Google
            </button>
          </div>
        </div>
      )}

      {/* בחירת תדירות */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">סוג האימון</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setFrequency('one-time')}
            className={`px-4 py-2 rounded ${frequency === 'one-time' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            אימון חד פעמי
          </button>
          <button
            onClick={() => setFrequency('recurring')}
            className={`px-4 py-2 rounded ${frequency === 'recurring' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            אימון קבוע
          </button>
        </div>
      </div>

      {/* תזמון אימונים - מוצג רק אם נבחר אימון קבוע */}
      {frequency === 'recurring' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">תדירות האימון הקבוע</h2>
          <select
            value={schedulePattern}
            onChange={(e) => setSchedulePattern(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">בחר תדירות אימון</option>
            {schedulePatterns.map(pattern => (
              <option key={pattern.id} value={pattern.id}>{pattern.name}</option>
            ))}
          </select>

          {/* הגדרות מותאמות אישית */}
          {schedulePattern === 'custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm text-gray-600 mb-2">ימי אימון רצופים</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={1}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ימי מנוחה</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={1}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}

          {/* בחירת סוג אימון A/B */}
          {schedulePattern === 'ab' && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setWorkoutType('A')}
                className={`flex-1 px-4 py-2 rounded ${workoutType === 'A' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
              >
                אימון A
              </button>
              <button
                onClick={() => setWorkoutType('B')}
                className={`flex-1 px-4 py-2 rounded ${workoutType === 'B' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
              >
                אימון B
              </button>
            </div>
          )}

          {/* תצוגת סיכום תבנית */}
          {schedulePattern && schedulePattern !== 'custom' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">סיכום אימון קבוע:</h3>
              <p className="text-sm text-gray-600">
                {schedulePattern === 'daily' && 'אימון כל יום'}
                {schedulePattern === 'alternate' && 'אימון, מנוחה, אימון, מנוחה...'}
                {schedulePattern === 'twoday' && 'יומיים אימון, יום מנוחה, יומיים אימון...'}
                {schedulePattern === 'ab' && 'אימון A, אימון B, מנוחה, אימון A...'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* בחירת סוג אימון */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">סוג האימון</h2>
        <select
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">בחר סוג אימון</option>
          {workoutTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      {/* ספריית תרגילים */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">תרגילים</h2>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            הוסף תרגיל
          </button>
        </div>

        {/* חלון מודאלי לספריית התרגילים */}
        {showExerciseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">ספריית תרגילים</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ExerciseList workoutType={workoutType} onSelectExercise={(exercise) => {
                addExercise(exercise);
                setShowExerciseModal(false);
              }} />
            </div>
          </div>
        )}

        {/* רשימת התרגילים הנבחרים */}
        <div className="space-y-4">
          {selectedExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`p-4 border rounded`}
            >
              <div className="flex items-center gap-4">
                {/* כפתורי סדר */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveExerciseUp(index)}
                    disabled={index === 0}
                    className={`p-1 text-gray-500 hover:text-gray-700 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    title="העבר למעלה"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveExerciseDown(index)}
                    disabled={index === selectedExercises.length - 1}
                    className={`p-1 text-gray-500 hover:text-gray-700 ${index === selectedExercises.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    title="העבר למטה"
                  >
                    ▼
                  </button>
                </div>

                {/* פרטי התרגיל */}
                <div className="flex-1">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <div className="flex gap-4 mt-2">
                    {exercise.type === 'running' ? (
                      <>
                        <div>
                          <label className="text-sm text-gray-600">מרחק (ק"מ):</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={exercise.distance}
                            onChange={(e) => updateExercise(exercise.id, 'distance', parseFloat(e.target.value))}
                            className="w-16 p-1 border rounded ml-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">מהירות (קמ"ש):</label>
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={exercise.speed}
                            onChange={(e) => updateExercise(exercise.id, 'speed', parseFloat(e.target.value))}
                            className="w-16 p-1 border rounded ml-2"
                          />
                        </div>
                        {exercise.incline !== undefined && (
                          <div>
                            <label className="text-sm text-gray-600">שיפוע (%):</label>
                            <input
                              type="number"
                              min="0"
                              max="15"
                              value={exercise.incline}
                              onChange={(e) => updateExercise(exercise.id, 'incline', parseInt(e.target.value))}
                              className="w-16 p-1 border rounded ml-2"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm text-gray-600">סטים:</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                            className="w-16 p-1 border rounded ml-2"
                          />
                        </div>
                        {exercise.type !== 'time' && (
                          <div>
                            <label className="text-sm text-gray-600">חזרות:</label>
                            <input
                              type="number"
                              min="1"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                              className="w-16 p-1 border rounded ml-2"
                            />
                          </div>
                        )}
                        {exercise.type === 'time' && (
                          <div>
                            <label className="text-sm text-gray-600">זמן (שניות):</label>
                            <input
                              type="number"
                              min="1"
                              value={exercise.time}
                              onChange={(e) => updateExercise(exercise.id, 'time', parseInt(e.target.value))}
                              className="w-16 p-1 border rounded ml-2"
                            />
                          </div>
                        )}
                        {exercise.type === 'weight' && (
                          <div>
                            <label className="text-sm text-gray-600">משקל (ק"ג):</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={exercise.weight}
                              onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value))}
                              className="w-16 p-1 border rounded ml-2"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* כפתור מחיקה */}
                <button
                  onClick={() => removeExercise(exercise.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="מחק תרגיל"
                >
                  ✕
                </button>

                {/* צ'קבוקס להשלמה */}
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={() => toggleExerciseCompletion(exercise.id)}
                  className="ml-2 w-5 h-5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* תזמון האימון */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">תזמון האימון</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">תאריך</label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">שעה</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">משך (דקות)</label>
            <input
              type="number"
              min="15"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* כפתור שמירה */}
      <div className="mt-8">
        <button
          onClick={handleSaveWorkout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          שמור אימון ביומן גוגל
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
