// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Auth.css'; // Import the new CSS file

// function Register() {
//   const [accountNumber, setAccountNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://localhost/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ accountNumber, password }),
//       });

//       if (response.ok) {
//         alert('Registration successful! Please log in.');
//         navigate('/login');
//       } else {
//         const data = await response.json();
//         console.error('Registration error:', data);
//         setErrorMessage(data.message || 'An error occurred. Please try again.');
//       }
//     } catch (error) {
//       console.error('Network error:', error); // Log the network error to the console
//       setErrorMessage('A network error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <div className="navigate">
//           <h2>Welcome Back!</h2>
//           <p>Enter Your Account Details in the Sign In Page</p>
//           <Link to="/login">
//         <button className="navigate-button">Sign In</button>
//         </Link>
//         </div>
//         <div className="form">
//           <h2>Create Account</h2>
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
//            <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//             <button type="submit" className="auth-button">Sign Up</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
