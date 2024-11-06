import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth({ setIsLoggedIn, setRoles }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { accountNumber, password };
  
    try {
      const response = await fetch(`https://localhost/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      console.log('Response status:', response.status); // Log the response status
  
      if (response.ok) {
        const data = await response.json();
        const { token, role } = data;
        // localStorage.setItem('jwt', token);
        // localStorage.setItem('role', role);
        // setIsLoggedIn(true);
        localStorage.setItem('jwt', token);
        localStorage.setItem('role', role.toLowerCase()); // Set role in lowercase
        setIsLoggedIn(true);
        setRoles([role.toLowerCase()]); // Immediately update roles state
        navigate('/payment');
      } else {
        const errorData = await response.json();
        console.log('Error response data:', errorData); // Log the error data
        setErrorMessage(errorData.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log the actual error
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth-button" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Auth;

