import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutVideos = () => {
  const navigate = useNavigate();

  const [workoutVideos] = React.useState([
    {
        id: 1,
        title: "אימון בוקר ביתי - חיטוב ושריפת שומנים | אימון גוף מלא בעצימות גבוהה",
        category: "full_body",
        embedCode: "https://www.youtube.com/embed/qcP8c5Pm1m8?si=jZsegUnKwokBg4D0",
        trainer: "Amit Yoga With Me",
        level: "כל הרמות"
    },
    {
      id: 2,
      title: "אימון בטן",
      category: "abs",
      embedCode: "https://www.youtube.com/embed/3p8EBPVZ2Iw",
      trainer: "מיכל לוי", 
      level: "מתקדמים"
    },
    {
      id: 3,
      title: "אימון רגליים",
      category: "legs",
      embedCode: "https://www.youtube.com/embed/RjexvOAsVtI",
      trainer: "יוסי לוי",
      level: "מתחילים"
    },
    {
      id: 4,
      title: "אימון ידיים",
      category: "arms",
      embedCode: "https://www.youtube.com/embed/dm7ZbgjZklE",
      trainer: "שירה כהן",
      level: "מתקדמים"
    },
    {
      id: 5,
      title: "אימון גב",
      category: "back",
      embedCode: "https://www.youtube.com/embed/rr6eFNNDQdU",
      trainer: "רון אבני",
      level: "מתחילים"
    },
    {
      id: 6,
      title: "אימון חזה",
      category: "chest",
      embedCode: `https://www.youtube.com/embed/iPQURX5Czag?si=kU3kdElcb9YaSRxj`,
      trainer: "דנה לוי",
      level: "מתקדמים"
    },
    {
      id: 7,
      title: "אימון כתפיים",
      category: "shoulders",
      embedCode: `https://www.youtube.com/embed/AXbj4kgA4HM?si=PVpmqPRvgAYpZxhw`,
      trainer: "Lidor Dayan",
      level: "מתחילים"
    },
    {
      id: 8,
      title: "אימון HIIT",
      category: "cardio",
      embedCode: "https://www.youtube.com/embed/ml6cT4AZdqI",
      trainer: "ליאור שדה",
      level: "מתקדמים"
    },
    {
      id: 9,
      title: "יוגה למתחילים",
      category: "yoga",
      embedCode: "https://www.youtube.com/embed/v7AYKMP6rOE",
      trainer: "מאיה שרון",
      level: "מתחילים"
    },
    {
      id: 10,
      title: "פילאטיס",
      category: "pilates",
      embedCode: "https://www.youtube.com/embed/K56Z12XNQ5c",
      trainer: "נועה לוי",
      level: "מתקדמים"
    },
    
    {
      id: 12,
      title: "סטרצ'ינג",
      category: "stretching",
      embedCode: "https://www.youtube.com/embed/sTxC3J3gQEU",
      trainer: "יעל כהן",
      level: "מתחילים"
    },
    {
      id: 13,
      title: "אימון TRX",
      category: "trx",
      embedCode: "https://www.youtube.com/embed/YdZFQpS9GY8",
      trainer: "גיל ששון",
      level: "מתקדמים"
    },
    {
      id: 14,
      title: "קרוספיט",
      category: "crossfit",
      embedCode: "https://www.youtube.com/embed/CBWQGb4LyAM",
      trainer: "אסף כהן",
      level: "מתקדמים"
    },
    {
      id: 15,
      title: "אימון פונקציונלי",
      category: "functional",
      embedCode: "https://www.youtube.com/embed/D7oV4wXMUws",
      trainer: "רותם שני",
      level: "מתחילים"
    },
    // המשך הסרטונים (16-30)
   {
    id: 16,
    title: "אימון קרדיו מתחילים",
    category: "cardio",
    embedCode: "https://www.youtube.com/embed/gC_L9qAHVJ8",
    trainer: "שיר אדר",
    level: "מתחילים"
  },
  {
    id: 17,
    title: "אימון כוח מתקדמים",
    category: "strength",
    embedCode: "https://www.youtube.com/embed/50kH47ZztHs",
    trainer: "איתי דרור",
    level: "מתקדמים"
  },
  {
    id: 19,
    title: "יוגה מתקדמים",
    category: "yoga",
    embedCode: "https://www.youtube.com/embed/9kOCY0KNByw",
    trainer: "דפנה מור",
    level: "מתקדמים"
  },
  {
    id: 20,
    title: "אימון רגליים וישבן",
    category: "legs",
    embedCode: "https://www.youtube.com/embed/Wp4BlxcFTkE",
    trainer: "מיטל שרון",
    level: "מתחילים"
  },
  {
    id: 21,
    title: "אירובי מתחילים",
    category: "cardio",
    embedCode: "https://www.youtube.com/embed/VHyGqsPOUHs",
    trainer: "רונית כץ",
    level: "מתחילים"
  },
  {
    id: 22,
    title: "אימון משולב כוח וקרדיו",
    category: "mixed",
    embedCode: "https://www.youtube.com/embed/u-_UjLwew-U",
    trainer: "אורי שמש",
    level: "מתקדמים"
  },
  {
    id: 23,
    title: "אימון גמישות",
    category: "flexibility",
    embedCode: "https://www.youtube.com/embed/L_xrDAtykMI",
    trainer: "נועה ברק",
    level: "מתחילים"
  },
  {
    id: 24,
    title: "אימון התנגדות עם גומיות",
    category: "resistance",
    embedCode: "https://www.youtube.com/embed/rXPLkz0cVoI",
    trainer: "טל אברהם",
    level: "מתחילים"
  },
  {
    id: 25,
    title: "אימון טבטה",
    category: "tabata",
    embedCode: "https://www.youtube.com/embed/XIeCMhNWFQQ",
    trainer: "גל דהן",
    level: "מתקדמים"
  },
  {
    id: 26,
    title: "אימון פלג גוף עליון",
    category: "upper_body",
    embedCode: "https://www.youtube.com/embed/8trituo-ppY",
    trainer: "דור לוי",
    level: "מתקדמים"
  },
  {
    id: 27,
    title: "אימון מתיחות מתקדם",
    category: "stretching",
    embedCode: "https://www.youtube.com/embed/GLy2rYHwUqY",
    trainer: "מאיה גל",
    level: "מתקדמים"
  },
  {
    id: 28,
    title: "אימון כושר בוקר",
    category: "morning_workout",
    embedCode: "https://www.youtube.com/embed/1skBf6h2ksI",
    trainer: "ליאת כהן",
    level: "מתחילים"
  },
  {
    id: 29,
    title: "אימון חיזוק ליציבה",
    category: "posture",
    embedCode: "https://www.youtube.com/embed/LT_dFRnmdGs",
    trainer: "רעות שדה",
    level: "מתחילים"
  },
  {
    id: 30,
    title: "אימון הרזיה מתקדם",
    category: "weight_loss",
    embedCode: "https://www.youtube.com/embed/H3jJ1q_M8iw",
    trainer: "אדם לוי",
    level: "מתקדמים"
  }
]);


  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">GYM</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200"
              >
                דף הבית
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200"
              >
                פרופיל
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutVideos.map(video => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-bold mb-2">{video.title}</h3>
              
              {/* YouTube Video */}
              <div className="relative pt-[56.25%] mb-4">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={video.embedCode}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">מאמן: {video.trainer}</p>
                <p className="text-sm text-gray-600">רמה: {video.level}</p>
                <p className="text-sm text-gray-600">קטגוריה: {video.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkoutVideos;