import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Secure Payments Portal</h1>
      <p>Your secure gateway for online transactions.</p>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/payment">Make a Payment</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
