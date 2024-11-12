import React, { useState } from 'react';

function AdminPanel() {
  const [activeSection, setActiveSection] = useState('users');
  
  // מידע לדוגמה - בפרויקט אמיתי יגיע מהשרת
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'member' },
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'trainer' }
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'אימון קבוצתי',
      date: '2024-03-15',
      time: '18:00',
      trainer: 'דני כהן',
      maxParticipants: 15
    }
  ]);

  // פונקציות ניהול משתמשים
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const [editingUser, setEditingUser] = useState(null);
  
  // טופס הוספת אירוע
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    trainer: '',
    maxParticipants: ''
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setNewEvent({ title: '', date: '', time: '', trainer: '', maxParticipants: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">פאנל ניהול</h2>

        {/* תפריט ניווט */}
        <div className="flex justify-center space-x-4 space-x-reverse mb-8">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-6 py-2 rounded-md ${
              activeSection === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ניהול משתמשים
          </button>
          <button
            onClick={() => setActiveSection('events')}
            className={`px-6 py-2 rounded-md ${
              activeSection === 'events' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ניהול אירועים
          </button>
        </div>

        {/* תוכן דינמי */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* ניהול משתמשים */}
          {activeSection === 'users' && (
            <div>
              <h3 className="text-xl font-bold mb-4">ניהול משתמשים</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-right">שם משתמש</th>
                      <th className="px-6 py-3 text-right">אימייל</th>
                      <th className="px-6 py-3 text-right">תפקיד</th>
                      <th className="px-6 py-3 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b">
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-800 ml-3"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ניהול אירועים */}
          {activeSection === 'events' && (
            <div>
              <h3 className="text-xl font-bold mb-4">ניהול אירועים</h3>
              
              {/* טופס הוספת אירוע */}
              <form onSubmit={handleAddEvent} className="mb-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם האירוע
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        תאריך
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        שעה
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מדריך
                    </label>
                    <input
                      type="text"
                      value={newEvent.trainer}
                      onChange={(e) => setNewEvent({...newEvent, trainer: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מספר משתתפים מקסימלי
                    </label>
                    <input
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={(e) => setNewEvent({...newEvent, maxParticipants: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    הוסף אירוע
                  </button>
                </div>
              </form>

              {/* רשימת אירועים */}
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium">{event.title}</h4>
                        <p className="text-gray-600">
                          {event.date} | {event.time}
                        </p>
                        <p className="text-gray-600">
                          מדריך: {event.trainer}
                        </p>
                        <p className="text-gray-600">
                          מקסימום משתתפים: {event.maxParticipants}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            // הוסף פונקציונליות עריכה
                          }}
                          className="text-blue-600 hover:text-blue-800 ml-3"
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => {
                            setEvents(events.filter(e => e.id !== event.id));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;