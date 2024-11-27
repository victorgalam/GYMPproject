import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { loadGoogleAPI, addEventToCalendar } from './googleCalendarConfig';

// קומפוננטת לוח השנה
const Calendar = ({ onDateSelect, selectedFormDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedFormDate) {
      const [year, month, day] = selectedFormDate.split('-');
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [selectedFormDate]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
  ];

  const weekDays = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect(formatDateForInput(newDate));
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isPastDay = currentDay < new Date(today.setHours(0, 0, 0, 0));
      const isSelected = selectedDate?.getDate() === day && 
                        selectedDate?.getMonth() === currentDate.getMonth() &&
                        selectedDate?.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div
          key={day}
          onClick={() => !isPastDay && handleDateClick(day)}
          className={`h-10 flex items-center justify-center cursor-pointer rounded-full
            ${isPastDay ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100'}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={nextMonth} className="p-2">&lt;</button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={prevMonth} className="p-2">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

// פונקציה ליצירת אופציות זמן
const generateTimeOptions = (startTime = null) => {
  const options = [];
  let start = 0;
  
  if (startTime) {
    const [hours] = startTime.split(':');
    start = parseInt(hours) + 1;
  }
  
  for (let hour = start; hour < 24; hour++) {
    const formattedHour = String(hour).padStart(2, '0');
    options.push(
      <option key={`${formattedHour}:00`} value={`${formattedHour}:00`}>
        {`${formattedHour}:00`}
      </option>
    );
    options.push(
      <option key={`${formattedHour}:30`} value={`${formattedHour}:30`}>
        {`${formattedHour}:30`}
      </option>
    );
  }
  return options;
};

const AddTrainingForm = ({ selectedDate }) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let roundedMinutes;
    
    if (minutes < 30) {
      roundedMinutes = "00";
    } else {
      roundedMinutes = "30";
    }

    const currentTime = `${String(hours).padStart(2, '0')}:${roundedMinutes}`;
    const endHours = String(hours + 1).padStart(2, '0');
    const endTime = `${endHours}:${roundedMinutes}`;

    setFormData(prev => ({
      ...prev,
      startTime: currentTime,
      endTime: endTime
    }));
  }, []);

  useEffect(() => {
    loadGoogleAPI()
      .then(() => {
        setIsApiLoaded(true);
      })
      .catch(error => {
        console.error('Error loading Google API:', error);
        alert('שגיאה בטעינת Google Calendar API');
      });
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
      setFormData(prev => ({
        ...prev,
        title: '',
        description: ''
      }));
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
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
            <CalendarIcon className="absolute left-2 top-2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">שעת התחלה:</label>
            <select 
              value={formData.startTime}
              onChange={(e) => {
                const newStartTime = e.target.value;
                const [hours, minutes] = newStartTime.split(':');
                const endHours = String(Number(hours) + 1).padStart(2, '0');
                setFormData({
                  ...formData, 
                  startTime: newStartTime,
                  endTime: `${endHours}:${minutes}`
                });
              }}
              className="w-full p-2 border rounded bg-white"
              required
            >
              {generateTimeOptions()}
            </select>
          </div>
          
          <div>
            <label className="block mb-2">שעת סיום:</label>
            <select
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              className="w-full p-2 border rounded bg-white"
              required
            >
              {generateTimeOptions(formData.startTime)}
            </select>
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

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-2 md:order-1">
          <Calendar onDateSelect={handleDateSelect} selectedFormDate={selectedDate} />
        </div>
        <div className="order-1 md:order-2">
          <AddTrainingForm selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;