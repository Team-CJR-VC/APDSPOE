import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Payment from './components/Payment';
import Register from './components/Register';
import Confirmation from './components/Confirmation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/payment">Payment</Link>
            </li>
            <li>
              <Link to="/confirmation">Confirmation</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;