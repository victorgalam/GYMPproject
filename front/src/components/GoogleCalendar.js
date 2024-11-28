import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
].join(' ');

const CalendarComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    description: ''
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Token Response:', tokenResponse);
      setAccessToken(tokenResponse.access_token);
      
      // Get user info
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const userData = await userInfo.json();
      console.log('User Data:', userData);
      
      setUserEmail(userData.email);
      setIsAuthenticated(true);
      
      const embeddedCalendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userData.email)}&ctz=Asia/Jerusalem&mode=WEEK&showPrint=0&showTabs=1&showCalendars=1&showTz=1&height=600`;
      setCalendarUrl(embeddedCalendarUrl);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    flow: 'implicit'
  });

  const handleAddWorkout = async () => {
    try {
      if (!accessToken) {
        console.error('No access token available');
        alert('נא להתחבר מחדש לחשבון Google');
        return;
      }

      const event = {
        'summary': newWorkout.title,
        'description': newWorkout.description,
        'start': {
          'dateTime': `${newWorkout.date}T${newWorkout.startTime}:00`,
          'timeZone': 'Asia/Jerusalem'
        },
        'end': {
          'dateTime': `${newWorkout.date}T${newWorkout.endTime}:00`,
          'timeZone': 'Asia/Jerusalem'
        }
      };

      console.log('Sending event:', event);
      console.log('Using access token:', accessToken);

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        alert('האימון נוסף בהצלחה ליומן!');
        setShowAddWorkout(false);
        setNewWorkout({
          title: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '10:00',
          description: ''
        });
      } else {
        throw new Error(responseData.error?.message || 'Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      if (error.message.includes('Invalid Credentials')) {
        alert('נא להתחבר מחדש לחשבון Google');
        setIsAuthenticated(false);
      } else {
        alert('אירעה שגיאה בהוספת האימון. נא לנסות שוב.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {!isAuthenticated ? (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">היומן שלי</h2>
          <div className="flex justify-center items-center h-64">
            <button
              onClick={() => login()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              <span>התחבר עם Google</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex">
          {/* Calendar Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">יומן אימונים</h2>
              <button
                onClick={() => setShowAddWorkout(!showAddWorkout)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center space-x-1 transition-colors duration-200"
              >
                <span className="text-xl mr-1">+</span>
                <span>הוסף אימון</span>
              </button>
            </div>
            <div className="calendar-container" style={{ height: 'calc(100vh - 80px)' }}>
              {calendarUrl && (
                <iframe
                  src={calendarUrl}
                  style={{ 
                    border: 0,
                    width: '100%',
                    height: '100%'
                  }}
                  frameBorder="0"
                  scrolling="no"
                  title="Google Calendar"
                />
              )}
            </div>
          </div>

          {/* Add Workout Form */}
          {showAddWorkout && (
            <div className="w-96 border-r bg-white shadow-lg animate-slide-in">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">אירוע חדש</h3>
                  <button
                    onClick={() => setShowAddWorkout(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                    className="w-full p-2 border-b focus:border-blue-500 focus:outline-none text-lg"
                    placeholder="הוסף כותרת"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">תאריך</label>
                    <input
                      type="date"
                      value={newWorkout.date}
                      onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                      className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">התחלה</label>
                    <input
                      type="time"
                      value={newWorkout.startTime}
                      onChange={(e) => setNewWorkout({ ...newWorkout, startTime: e.target.value })}
                      className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">סיום</label>
                    <input
                      type="time"
                      value={newWorkout.endTime}
                      onChange={(e) => setNewWorkout({ ...newWorkout, endTime: e.target.value })}
                      className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    rows="3"
                    placeholder="הוסף תיאור"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => setShowAddWorkout(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleAddWorkout}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    שמור
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GoogleCalendar = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <CalendarComponent />
    </GoogleOAuthProvider>
  );
};

export default GoogleCalendar;
