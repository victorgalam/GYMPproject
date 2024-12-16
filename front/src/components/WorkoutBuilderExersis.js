import React from 'react';

// נתונים סטטיים לדוגמה - בהמשך אפשר להעביר למסד נתונים
export const exerciseLibrary = {

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

  },

  other: {

    custom: [

      { id: 'custom_cardio', name: 'אימון קרדיו מותאם אישית', defaultSets: 1, type: 'time', defaultTime: 30 },

      { id: 'custom_strength', name: 'אימון כוח מותאם אישית', defaultSets: 3, defaultReps: 12, type: 'weight' },

      { id: 'custom_flexibility', name: 'אימון גמישות', defaultSets: 3, defaultTime: 30, type: 'time' },

      { id: 'custom_hiit', name: 'אימון HIIT', defaultSets: 4, defaultTime: 45, type: 'time' },

      { id: 'custom_mobility', name: 'אימון מוביליטי', defaultSets: 3, defaultTime: 45, type: 'time' },

      { id: 'custom_yoga', name: 'יוגה', defaultSets: 1, defaultTime: 60, type: 'time' },

      { id: 'custom_pilates', name: 'פילאטיס', defaultSets: 1, defaultTime: 45, type: 'time' },

      { id: 'custom_boxing', name: 'אגרוף', defaultSets: 3, defaultTime: 180, type: 'time' },

      { id: 'custom_swimming', name: 'שחייה', defaultSets: 1, type: 'distance', defaultDistance: 1 },

      { id: 'custom_cycling', name: 'רכיבת אופניים', defaultSets: 1, type: 'distance', defaultDistance: 10 }

    ],

    stretching: [

      { id: 'stretch_hamstrings', name: 'מתיחות רגליים אחוריות', defaultSets: 3, defaultTime: 30, type: 'time' },

      { id: 'stretch_quads', name: 'מתיחות ירכיים קדמיות', defaultSets: 3, defaultTime: 30, type: 'time' },

      { id: 'stretch_back', name: 'מתיחות גב', defaultSets: 3, defaultTime: 30, type: 'time' },

      { id: 'stretch_shoulders', name: 'מתיחות כתפיים', defaultSets: 3, defaultTime: 30, type: 'time' }

    ],

    recovery: [

      { id: 'foam_rolling', name: 'פאום רולר', defaultSets: 1, defaultTime: 300, type: 'time' },

      { id: 'meditation', name: 'מדיטציה', defaultSets: 1, defaultTime: 600, type: 'time' },

      { id: 'breathing', name: 'תרגילי נשימה', defaultSets: 3, defaultTime: 60, type: 'time' }

    ]

  }

};

export const workoutTypes = [

  { id: 'gym', name: '  חדר כושר' },

  { id: 'calisthenics', name: 'קליסטניקס' },

  { id: 'running', name: 'ריצה' },

  { id: 'other', name: 'אימונים נוספים', categories: ['custom', 'stretching', 'recovery'] }

];

export const schedulePatterns = [

  { id: 'daily', name: 'כל יום', days: 1, rest: 0 },

  { id: 'alternate', name: 'יום כן יום לא', days: 1, rest: 1 },

  { id: 'twoday', name: 'יומיים אימון יום מנוחה', days: 2, rest: 1 },

  { id: 'ab', name: 'אימון A אימון B מנוחה', days: 2, rest: 1, split: true },

  { id: 'custom', name: 'התאמה אישית', days: 0, rest: 0 }

];

export const getExerciseMetrics = (exercise) => {

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

export const getCategoryName = (category) => {

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

export const ExerciseList = ({ workoutType, onSelectExercise }) => {

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

export default ExerciseList;