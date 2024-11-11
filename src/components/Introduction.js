import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "ברוכים הבאים ל-GYM",
      description: "המקום שלך לנהל את האימונים שלך בצורה חכמה ויעילה",
      icon: "💪"
    },
    {
      title: "מעקב אימונים",
      description: "עקוב אחר ההתקדמות שלך, תעד אימונים ותראה את השיפור לאורך זמן",
      icon: "📊"
    },
    {
      title: "תוכנית אימונים אישית",
      description: "קבל תוכנית אימונים מותאמת אישית ועדכן אותה בהתאם להתקדמות שלך",
      icon: "📝"
    },
    {
      title: "סטטיסטיקות ומדדים",
      description: "צפה בנתונים מפורטים על הביצועים שלך וקבל תובנות לשיפור",
      icon: "📈"
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // כאן תוכל להוסיף לוגיקה לשמירת סטטוס שהמשתמש כבר ראה את דף ההיכרות
      navigate('/home'); // או לכל דף אחר שתרצה להפנות אליו
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg">
        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-t-2xl">
          <div 
            className="h-full bg-blue-500 rounded-t-2xl transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Icon */}
          <div className="text-6xl mb-6 text-center">
            {steps[currentStep].icon}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-lg">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Steps indicator */}
          <div className="flex justify-center mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              דלג
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition duration-200"
            >
              {currentStep === steps.length - 1 ? 'בואו נתחיל!' : 'המשך'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;