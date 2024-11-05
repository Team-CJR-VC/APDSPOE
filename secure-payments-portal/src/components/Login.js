// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Auth.css'; // Import the new CSS file

// function Login({ setIsLoggedIn }) {
//   const [accountNumber, setAccountNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://localhost/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ accountNumber, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const { token } = data;

//         // Store the token in localStorage
//         localStorage.setItem('jwt', token);

//         // Set isLoggedIn to true
//         setIsLoggedIn(true);

//         // Navigate to the payment page after login
//         navigate('/payment');
//       } else {
//         const data = await response.json();
//         console.error('Login error:', data);
//         setErrorMessage(data.message || 'An error occurred. Please try again.');
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//       setErrorMessage('A network error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <div className="form">
//           <h2>Sign In</h2>
//           {errorMessage && <p className="error">{errorMessage}</p>}
//           <form className="form-value" onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Account Number"
//               value={accountNumber}
//               onChange={(e) => setAccountNumber(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className="auth-button">Sign In</button>
//           </form>
//         </div>
//         <div className="navigate">
//           <h2>Hello, User!</h2>
//           <p>Don't have an account? Create One</p>
//           <Link to="/Register">
//           <button className="navigate-button">Sign Up</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
