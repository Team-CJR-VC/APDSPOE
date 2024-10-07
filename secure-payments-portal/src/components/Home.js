import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <body className="gradient-background">
      <div className="content-container">
        <h1>Welcome to the Secure Payments Portal</h1>
        <p>Your secure gateway for online transactions. Developed by CJR</p>
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
            <li>
              <Link to="/auth/register">Register</Link>
            </li>
            <li>
              <Link to="/payment">Make a Payment</Link>
            </li>
          </ul>
        </nav>
      </div>
    </body>
  );
}

export default Home;