import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function WorkoutChecklist() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${workoutId}`);
        const data = await response.json();
        if (response.ok) {
          setWorkout(data);
          // יצירת מערך של תרגילים עם מצב השלמה
          setExercises(data.exercises.map(exercise => ({
            ...exercise,
            completed: false
          })));
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const toggleExercise = (index) => {
    setExercises(prevExercises => {
      const newExercises = [...prevExercises];
      newExercises[index] = {
        ...newExercises[index],
        completed: !newExercises[index].completed
      };
      return newExercises;
    });
  };

  const calculateProgress = () => {
    if (!exercises.length) return 0;
    const completed = exercises.filter(ex => ex.completed).length;
    return Math.round((completed / exercises.length) * 100);
  };

  if (!workout) {
    return <div className="text-center p-4">טוען...</div>;
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{workout.title}</h1>
          <button
            onClick={() => navigate('/panel')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            חזור
          </button>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{calculateProgress()}% הושלם</p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleExercise(index)}
            >
              <input
                type="checkbox"
                checked={exercise.completed}
                onChange={() => toggleExercise(index)}
                className="h-5 w-5 text-green-600 ml-4"
              />
              <div className="flex-1">
                <h3 className={`font-semibold ${exercise.completed ? 'line-through text-gray-500' : ''}`}>
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {exercise.sets} סטים × {exercise.reps} חזרות
                  {exercise.weight > 0 && ` | משקל: ${exercise.weight} ק"ג`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
