import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountNumber, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        navigate('/payment');
      } else {
        const data = await response.json();
        console.error('Login error:', data);
        setErrorMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error); // Log the network error to the console
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Number:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
