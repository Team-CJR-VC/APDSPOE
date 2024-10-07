import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Auth.css';

function Auth({ setIsLoggedIn }) {
  const { mode } = useParams(); // Get the mode from the URL (login or register)
  const [isLogin, setIsLogin] = useState(true); // Tracks if login or register form is active
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode === 'login'); // Determine the form based on the URL param
    setIsFlipped(mode === 'register'); // Flip the card based on the mode
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? 'login' : 'register';
    const data = { accountNumber, password };

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`https://localhost/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (isLogin) {
          const data = await response.json();
          const { token } = data;
          localStorage.setItem('jwt', token);
          setIsLoggedIn(true);
          navigate('/payment');
        } else {
          alert('Registration successful! Please log in.');
          navigate('/auth/login'); // Switch to login form after successful registration
        }
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  // Flip the card manually on button click (alternative navigation)
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    navigate(isLogin ? '/auth/register' : '/auth/login');
  };

  return (
    <div className="auth-container">
      <div className="flip-card">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front side (Login) */}
          <div className="auth-box login-side">
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
            <div className="login-navigate">
              <h2>Hello, User!</h2>
              <p>Don't have an account? Create One</p>
              <button className="navigate-button" onClick={handleFlip}>Sign Up</button>
            </div>
          </div>

          {/* Back side (Register) */}
          <div className="auth-box register-side">
            <div className="register-navigate">
              <h2>Welcome Back!</h2>
              <p>Enter your account details in the Sign In page</p>
              <button className="navigate-button" onClick={handleFlip}>Sign In</button>
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
              <h2>Create Account</h2>
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
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="auth-button" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
