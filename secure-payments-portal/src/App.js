// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
// import Login from './components/Login';
// import Payment from './components/Payment';
// import Register from './components/Register';
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
//     navigate('/login');
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
//                 <LogoutButton className="logout-button" handleLogout={handleLogout} />
//               </li>
//             ) : (
//               <>
//                 <li>
//                   <Link to="/login">Login</Link>
//                 </li>
//                 <li>
//                   <Link to="/register">Register</Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </nav>

//         {/* Routes */}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/register" element={<Register />} />
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
//     <button onClick={() => handleLogout(navigate)}>Logout</button>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Auth from './components/Auth'; // Using Auth component for both login and register
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import Home from './components/Home';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (JWT token exists)
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  // Logout function
  const handleLogout = (navigate) => {
    // Clear the token
    localStorage.removeItem('jwt');

    // Update state to reflect logged out status
    setIsLoggedIn(false);

    // Redirect to the login page
    navigate('/auth/login');
  };

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
            {/* If user is logged in, show Logout button; otherwise, show Login/Register */}
            {isLoggedIn ? (
              <li>
                <LogoutButton handleLogout={handleLogout} />
              </li>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Login</Link>
                </li>
                <li>
                  <Link to="/auth/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:mode" element={<Auth setIsLoggedIn={setIsLoggedIn} />} /> {/* For login and register */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
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

