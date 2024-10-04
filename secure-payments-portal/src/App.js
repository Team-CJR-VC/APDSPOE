import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Payment from './components/Payment';
import Register from './components/Register';
import Confirmation from './components/Confirmation';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/payment">Payment</Link>
            </li>
          </ul>

          {/* Right-aligned menu */}
          <ul className="right-menu">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
