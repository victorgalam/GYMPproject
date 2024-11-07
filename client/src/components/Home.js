import React from 'react';
import Navbar from './Navbar';

function Home() {
  return (
    <div>
      <Navbar /> {/* הוספת ה-Navbar */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>GYM</h1>
        <p>זהו דף הבית למשתמש רגיל. כאן תוכל לראות את המידע האישי שלך בלבד.</p>
      </div>
    </div>
  );
}

export default Home;
