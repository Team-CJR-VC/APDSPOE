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
// import * as jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import Auth from './components/Auth';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import Home from './components/Home';
import CreateAccount from './components/AdminCreateAccount';
import CreateUserAccount from './components/EmployeeCreateAccount';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);

  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   if (token) {
  //     setIsLoggedIn(true);
  //     const decodedToken = jwtDecode(token); // Use jwt_decode here
  //     setRoles(Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.role || '']);
  //   } else {
  //     setIsLoggedIn(false);
  //     setRoles([]);
  //   }
  // }, []);

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
  }, [isLoggedIn, roles]);

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
                {hasRole('admin') && <li><Link to="/create-account">Create Account</Link></li>}
                {hasRole('employee') && <li><Link to="/create-user">Create User Account</Link></li>}
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
          <Route path="/confirmation" element={<Confirmation />} />
          {hasRole('admin') && <Route path="/create-account" element={<CreateAccount />} />}
          {hasRole('employee') && <Route path="/create-user" element={<CreateUserAccount />} />}
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
