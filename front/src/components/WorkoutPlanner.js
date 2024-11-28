// Workout.js
import React, { useState } from 'react';

const exercises = [
  { id: 1, name: 'ריצה' },
  { id: 2, name: 'שכיבות סמיכה' },
  { id: 3, name: 'מתח' },
  { id: 4, name: 'סקוואט' },
  { id: 5, name: 'פלאנק' },
];

const WorkoutPlanner = () => {
  const [workout, setWorkout] = useState([]);

  const handleExerciseToggle = (id) => {
    setWorkout(prevWorkout => {
      if (prevWorkout.includes(id)) {
        return prevWorkout.filter(id => id !== id);
      } else {
        return [...prevWorkout, id];
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">האימון שלך</h2>
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={workout.includes(exercise.id)}
                onChange={() => handleExerciseToggle(exercise.id)}
                className="mr-2"
              />
              {exercise.name}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="font-medium">תרגילים נבחרים:</h3>
        <p>{workout.map(id => exercises.find(e => e.id === id).name).join(', ')}</p>
      </div>
    </div>
  );
};

export default WorkoutPlanner;