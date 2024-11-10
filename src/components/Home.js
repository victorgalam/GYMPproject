import React from 'react';

const Home = () => {
  // נתונים לדוגמה - במציאות יגיעו מהשרת
  const progressData = {
    strength: 75,
    endurance: 60,
    flexibility: 45
  };

  const workoutPlan = [
    { day: "ראשון", type: "אימון כוח - חזה וכתפיים" },
    { day: "שלישי", type: "אימון רגליים" },
    { day: "חמישי", type: "אימון גב" }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar מובנה */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">GYM</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                פרופיל
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* כרטיס פרטי מתאמן ומאמן */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">פרטים אישיים</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">המאמן שלי:</h3>
                <p>דני כהן</p>
                <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  החלף מאמן
                </button>
              </div>
            </div>
          </div>

          {/* כרטיס התקדמות חודשית */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">התקדמות חודשית</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>כוח</span>
                  <span>{progressData.strength}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressData.strength}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>סיבולת</span>
                  <span>{progressData.endurance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressData.endurance}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>גמישות</span>
                  <span>{progressData.flexibility}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressData.flexibility}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* כרטיס תוכנית אימונים */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">תוכנית אימונים שבועית</h2>
            </div>
            <div className="space-y-4">
              {workoutPlan.map((workout, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div>
                    <p className="font-semibold">יום {workout.day}</p>
                    <p className="text-gray-600">{workout.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* כפתור בניית אימון */}
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium">
            בנה אימון חדש
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;