import React from 'react';

const GymRecommendations = ({ formData }) => {
  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }

  const getIntensityRecommendation = () => {
    const { experience, medicalConditions } = formData;
    if (medicalConditions) return 'נמוכה עד בינונית';
    switch (experience) {
      case 'מתחיל': return 'נמוכה עד בינונית';
      case 'מתחיל מתקדם': return 'בינונית';
      case 'מתאמן': return 'בינונית עד גבוהה';
      case 'מתקדם': return 'גבוהה';
      default: return 'בינונית';
    }
  };

  const getWorkoutDuration = () => {
    const { experience } = formData;
    switch (experience) {
      case 'מתחיל': return '30-45 דקות';
      case 'מתחיל מתקדם': return '45-60 דקות';
      case 'מתאמן':
      case 'מתקדם': return '60-90 דקות';
      default: return '45-60 דקות';
    }
  };

  const calculateBmi = () => {
    const heightInMeters = formData.height / 100;
    return formData.weight / (heightInMeters * heightInMeters);
  };

  const getBmiInfo = (bmi) => {
    if (bmi < 18.5) return { category: 'תת משקל', color: '#60A5FA', lightColor: '#DBEAFE' };
    if (bmi < 25) return { category: 'משקל תקין', color: '#34D399', lightColor: '#D1FAE5' };
    if (bmi < 30) return { category: 'עודף משקל', color: '#FBBF24', lightColor: '#FEF3C7' };
    return { category: 'השמנה', color: '#F87171', lightColor: '#FEE2E2' };
  };

  const bmi = calculateBmi();
  const bmiInfo = getBmiInfo(bmi);
  const rotation = Math.min(180, Math.max(0, (bmi - 15) * (180 / 25)));

  const getSpecificRecommendations = () => {
    const recommendations = [];
    
    // המלצות על פי BMI
    if (bmi < 18.5) {
      recommendations.push({
        title: 'המלצות למצב תת משקל',
        description: 'התמקד בבניית מסת שריר ועלייה במשקל בריאה. הגדל צריכה קלורית ושלב אימוני כוח. התייעץ עם תזונאי/ת.'
      });
    } else if (bmi >= 25) {
      recommendations.push({
        title: 'המלצות לירידה בריאה במשקל',
        description: 'שלב אימוני כוח עם אימוני סיבולת. התחל בעצימות נמוכה והעלה בהדרגה. מומלץ להתייעץ עם מאמן כושר אישי.'
      });
    }
    
    // המלצות על פי מטרות
    formData.goals.forEach(goal => {
      switch (goal) {
        case 'ירידה במשקל':
          recommendations.push({
            title: 'המלצות לירידה במשקל',
            description: 'שלב אימוני קרדיו (20-30 דקות) בסוף כל אימון משקולות. התמקד באימונים מעגליים עם מעט זמני מנוחה.'
          });
          break;
        case 'בניית מסת שריר':
          recommendations.push({
            title: 'המלצות לבניית שריר',
            description: 'התמקד במשקלים כבדים יחסית (70-85% מהמשקל המקסימלי) עם 8-12 חזרות בסט. בצע 3-4 סטים לכל תרגיל.'
          });
          break;
        case 'שיפור סיבולת':
          recommendations.push({
            title: 'המלצות לשיפור סיבולת',
            description: 'שלב אימוני אינטרוולים עצימים (HIIT) פעמיים בשבוע. התחל עם 20 דקות ועלה בהדרגה.'
          });
          break;
      }
    });

    if (formData.preferredTime === 'בוקר מוקדם') {
      recommendations.push({
        title: 'המלצות לאימון בוקר',
        description: 'הקפד על ארוחת בוקר קלה כשעה לפני האימון. בצע חימום ארוך יותר בשעות הבוקר המוקדמות.'
      });
    }

    if (formData.daysPerWeek === '5-6' || formData.daysPerWeek === '7') {
      recommendations.push({
        title: 'המלצות לאימונים תכופים',
        description: 'חשוב לחלק את האימונים לקבוצות שרירים שונות ולהקפיד על ימי מנוחה. שקול לשלב אימונים קלים יותר לשיקום.'
      });
    }

    return recommendations;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">המלצות אימון מותאמות אישית</h2>

        {/* BMI Display */}
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">מדד מסת גוף (BMI)</h3>
            <p className="text-sm text-gray-500 mt-1">המדד מחושב לפי גובה ומשקל</p>
          </div>

          <div className="relative mb-8">
            <svg viewBox="0 0 200 150" className="w-full">
              {/* Background Track */}
              <path
                d="M 30 120 A 70 70 0 0 1 170 120"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="16"
              />
              
              {/* Colored Segments */}
              <path
                d="M 30 120 A 70 70 0 0 1 72.5 120"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="16"
              />
              <path
                d="M 72.5 120 A 70 70 0 0 1 115 120"
                fill="none"
                stroke="#34D399"
                strokeWidth="16"
              />
              <path
                d="M 115 120 A 70 70 0 0 1 142.5 120"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="16"
              />
              <path
                d="M 142.5 120 A 70 70 0 0 1 170 120"
                fill="none"
                stroke="#F87171"
                strokeWidth="16"
              />

              {/* Category Labels */}
              <text x="30" y="145" textAnchor="middle" fill="#6B7280" className="text-xs">15</text>
              <text x="72.5" y="145" textAnchor="middle" fill="#6B7280" className="text-xs">18.5</text>
              <text x="115" y="145" textAnchor="middle" fill="#6B7280" className="text-xs">25</text>
              <text x="142.5" y="145" textAnchor="middle" fill="#6B7280" className="text-xs">30</text>
              <text x="170" y="145" textAnchor="middle" fill="#6B7280" className="text-xs">40</text>

              {/* Needle */}
              <g transform={`rotate(${rotation}, 100, 120)`}>
                <line
                  x1="100"
                  y1="120"
                  x2="100"
                  y2="60"
                  stroke="#1F2937"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="120" r="6" fill="#1F2937" />
              </g>
            </svg>
          </div>

          {/* Result Display */}
          <div 
            className="text-center p-4 rounded-lg mb-4"
            style={{ backgroundColor: bmiInfo.lightColor }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: bmiInfo.color }}>
              {bmi.toFixed(1)}
            </div>
            <div className="text-lg font-semibold" style={{ color: bmiInfo.color }}>
              {bmiInfo.category}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="p-2 rounded" style={{ backgroundColor: '#DBEAFE' }}>
              <span className="block text-blue-500 font-medium">תת משקל</span>
              <span className="text-xs text-gray-500">{'<'}18.5</span>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: '#D1FAE5' }}>
              <span className="block text-green-500 font-medium">תקין</span>
              <span className="text-xs text-gray-500">18.5-24.9</span>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: '#FEF3C7' }}>
              <span className="block text-yellow-600 font-medium">עודף</span>
              <span className="text-xs text-gray-500">25-29.9</span>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2' }}>
              <span className="block text-red-500 font-medium">השמנה</span>
              <span className="text-xs text-gray-500">30+</span>
            </div>
          </div>
        </div>

        {/* Basic Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">עצימות מומלצת</h3>
            <p className="text-blue-600">{getIntensityRecommendation()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">משך אימון מומלץ</h3>
            <p className="text-blue-600">{getWorkoutDuration()}</p>
          </div>
        </div>

        {/* Specific Recommendations */}
        <div className="space-y-4">
          {getSpecificRecommendations().map((rec, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">{rec.title}</h3>
              <p className="mt-1 text-gray-600">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymRecommendations;