// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
// import Auth from './components/Auth'; // Using Auth component for both login and register
// import Payment from './components/Payment';
// import Confirmation from './components/Confirmation';
// import Home from './components/Home';
// import './App.css';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check if user is logged in (JWT token exists)
//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
//   }, []);

//   // Logout function
//   const handleLogout = (navigate) => {
//     // Clear the token
//     localStorage.removeItem('jwt');

//     // Update state to reflect logged out status
//     setIsLoggedIn(false);

//     // Redirect to the login page
//     navigate('/auth/login');
//   };

//   return (
//     <Router>
//       <div className="App">
//         {/* Navbar */}
//         <nav className="navbar">
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/payment">Payment</Link>
//             </li>
//           </ul>

//           {/* Right-aligned menu */}
//           <ul className="right-menu">
//             {/* If user is logged in, show Logout button; otherwise, show Login/Register */}
//             {isLoggedIn ? (
//               <li>
//                 <LogoutButton handleLogout={handleLogout} />
//               </li>
//             ) : (
//               <>
//                 <li>
//                   <Link to="/auth/login">Login</Link>
//                 </li>
//                 <li>
//                   <Link to="/auth/register">Register</Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </nav>

//         {/* Routes */}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/auth/:mode" element={<Auth setIsLoggedIn={setIsLoggedIn} />} /> {/* For login and register */}
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/confirmation" element={<Confirmation />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// // Logout button component
// function LogoutButton({ handleLogout }) {
//   const navigate = useNavigate();
//   return (
//     <button className="logout-button" onClick={() => handleLogout(navigate)}>Logout</button>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode'; // Use to decode the JWT token
//REF: https://stackoverflow.com/questions/41818822/how-to-import-the-jwt-decode-type-definition-into-typescript-ionic-2
import * as JWT from 'jwt-decode';
import Auth from './components/Auth';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import Home from './components/Home';
import CreateAccount from './components/AdminCreateAccount';
import CreateUserAccount from './components/EmployeeCreateAccount';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // New state for storing the user's role

  // Check if user is logged in and retrieve role
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
      // const decodedToken = jwtDecode(token); // Use jwt_decode here
      const decodedToken = JWT(token); // Use jwt_decode here
      setRole(decodedToken.role); // Extract role from the token
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  // Logout function
  const handleLogout = (navigate) => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/auth/login');
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            {isLoggedIn && (
              <>
                <li><Link to="/payment">Payment</Link></li>
                {role === 'admin' && (
                  <li><Link to="/create-account">Create Account</Link></li> // Admin-only link
                )}
                {role === 'employee' && (
                  <li><Link to="/create-user">Create User Account</Link></li> // Employee-only link
                )}
              </>
            )}
          </ul>

          <ul className="right-menu">
            {isLoggedIn ? (
              <li><LogoutButton handleLogout={handleLogout} /></li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:mode" element={<Auth setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {role === 'admin' && (
            <Route path="/create-account" element={<CreateAccount />} /> // Admin-only route
          )}
          {role === 'employee' && (
            <Route path="/create-user" element={<CreateUserAccount />} /> // Employee-only route
          )}
        </Routes>
      </div>
    </Router>
  );
}

// Logout button component
function LogoutButton({ handleLogout }) {
  const navigate = useNavigate();
  return (
    <button className="logout-button" onClick={() => handleLogout(navigate)}>Logout</button>
  );
}

export default App;

