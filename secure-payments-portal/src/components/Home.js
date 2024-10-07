import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="gradient-background">
      <div className="content-container">
        <h1>Welcome to the Secure Payments Portal</h1>
        <p>Your secure gateway for online transactions.</p>
        <nav>
          <ul>
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
    </div>
  );
}

export default Home;
