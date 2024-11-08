import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Auth from './components/Auth';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import Home from './components/Home';
import CreateAccount from './components/AdminCreateAccount';
import CreateUserAccount from './components/EmployeeCreateAccount';
import Transactions from './components/Transactions';
import AllTransactions from './components/AllTransactions';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setRoles(Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.role || '']);
    } else {
      setIsLoggedIn(false);
      setRoles([]);
    }
  }, []);

  const handleLogout = (navigate) => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setRoles([]);
    navigate('/auth/login');
  };

  const hasRole = (role) => roles.includes(role);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            {isLoggedIn && (
              <>
                <li><Link to="/payment">Payment</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                {hasRole('admin') && <li><Link to="/create-account">Create Account</Link></li>}
                {hasRole('employee') && <li><Link to="/create-user">Create User Account</Link></li>}
                {hasRole('admin' || 'employee') && <li><Link to="/all-transactions">All Transactions</Link></li>}
              </>
            )}
          </ul>

          <ul className="right-menu">
            {isLoggedIn ? (
              <li><LogoutButton handleLogout={handleLogout} /></li>
            ) : (
              <li><Link to="/auth/login">Login</Link></li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:mode" element={<Auth setIsLoggedIn={setIsLoggedIn} setRoles={setRoles} />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {hasRole('admin') && <Route path="/create-account" element={<CreateAccount />} />}
          {hasRole('employee') && <Route path="/create-user" element={<CreateUserAccount />} />}
          {hasRole('admin' || 'employee') && <Route path="/all-transactions" element={<AllTransactions />} />}
        </Routes>
      </div>
    </Router>
  );
}

function LogoutButton({ handleLogout }) {
  const navigate = useNavigate();
  return (
    <button className="logout-button" onClick={() => handleLogout(navigate)}>Logout</button>
  );
}

export default App;
