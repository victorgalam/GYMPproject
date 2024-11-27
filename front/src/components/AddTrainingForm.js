import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { loadGoogleAPI, addEventToCalendar } from './googleCalendarConfig';  // עדכון הנתיב

const AddTrainingForm = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    const loadAPI = async () => {
      try {
        await loadGoogleAPI();
        setIsApiLoaded(true);
      } catch (error) {
        console.error('Error loading Google API:', error);
        alert('שגיאה בטעינת Google Calendar API');
      }
    };
    
    loadAPI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isApiLoaded) {
      alert('אנא המתן לטעינת Google Calendar API');
      return;
    }

    const event = {
      'summary': formData.title,
      'description': formData.description,
      'start': {
        'dateTime': `${formData.date}T${formData.startTime}:00`,
        'timeZone': 'Asia/Jerusalem'
      },
      'end': {
        'dateTime': `${formData.date}T${formData.endTime}:00`,
        'timeZone': 'Asia/Jerusalem'
      }
    };

    try {
      await addEventToCalendar(event);
      alert('האימון נוסף בהצלחה ליומן Google!');
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('אירעה שגיאה בהוספת האימון');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-right">הוספת אימון חדש</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div>
          <label className="block mb-2">כותרת האימון:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">תאריך:</label>
          <div className="relative">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <CalendarIcon className="absolute left-2 top-2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">שעת התחלה:</label>
            <div className="relative">
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <Clock className="absolute left-2 top-2 text-gray-400" size={20} />
            </div>
          </div>
          
          <div>
            <label className="block mb-2">שעת סיום:</label>
            <div className="relative">
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <Clock className="absolute left-2 top-2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2">פרטים נוספים:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          הוסף אימון
        </button>
      </form>
    </div>
  );
};

export default AddTrainingForm;