import React, { useState } from 'react';



function AdminPanel() {
  const [activeSection, setActiveSection] = useState('registers');

  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>פאנל ניהול</h2>
      <div>
        <button onClick={() => showSection('registers')}>Registers</button>
        <button onClick={() => showSection('users')}>Users</button>
        <button onClick={() => showSection('exercises')}>Exercises</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {activeSection === 'registers' && <p>ניהול רשומות</p>}
        {activeSection === 'users' && <p>ניהול משתמשים</p>}
        {activeSection === 'exercises' && <p>ניהול תרגילים</p>}
      </div>
    </div>
  );
}

export default AdminPanel;
