import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: '#fff', textAlign: 'center' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ display: 'inline', margin: '0 15px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>דף הבית</Link>
        </li>
        <li style={{ display: 'inline', margin: '0 15px' }}>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>התחברות</Link>
        </li>
        <li style={{ display: 'inline', margin: '0 15px' }}>
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>הרשמה</Link>
        </li>
        {/* <li style={{ display: 'inline', margin: '0 15px' }}>
          <Link to="/register/admin" style={{ color: '#fff', textDecoration: 'none' }}>הרשמה לאדמין</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
