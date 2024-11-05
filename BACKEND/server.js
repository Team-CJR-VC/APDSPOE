// const fs = require('fs');
// const https = require('https');
// const express = require('express');
// const helmet = require('helmet');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const morgan = require('morgan');
// const winston = require('winston');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const constants = require('constants');
// const cookieParser = require('cookie-parser'); // #3: Adding cookie-parser for session handling
// const { body, validationResult } = require('express-validator'); //comment #3: Add express-validator for input validation (to prevent SQL Injection)
// const rateLimit = require('express-rate-limit'); // #3: Import express-rate-limit for rate limiting

// const app = express();

// // Load environment variables
// require('dotenv').config();
// const mongoURI = process.env.MONGO_URI;

// // Connect to MongoDB Atlas
// mongoose.connect(mongoURI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Create a logger instance using winston
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.Console({ format: winston.format.simple() }),
//   ],
// });

// // Enable CORS and security headers
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser()); //comment #3: Parse cookies from incoming requests

// // Configure Helmet with HSTS and Clickjacking protection
// app.use(helmet({
//   hsts: {
//     maxAge: 63072000,  // 2 years in seconds
//     includeSubDomains: true,  // Apply to subdomains
//     preload: true  // Allow browsers to preload HSTS settings
//   },
//   frameguard: { //comment #3: Adding Clickjacking protection to prevent iframes
//     action: 'deny' // Deny embedding your site in an iframe
//   }
// }));

// app.use(morgan('combined')); // Log incoming requests

// // Create a rate limiter
// const limiter = rateLimit({ //comment #3: Implementing rate limiting to prevent DDoS attacks
//   windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.' // Custom response message
// });

// // Apply rate limiter to all requests
// app.use(limiter); //comment #3: Apply the rate limiter globally

// // HTTP to HTTPS redirection middleware
// app.use((req, res, next) => {
//   if (req.secure) {
//     // Already HTTPS, continue
//     return next();
//   } else {
//     // Redirect HTTP to HTTPS
//     res.redirect(`https://${req.headers.host}${req.url}`);
//   }
// });

// // // Create a User model
// // const UserSchema = new mongoose.Schema({
// //   accountNumber: { type: String, required: true, unique: true },
// //   passwordHash: { type: String, required: true },
// // });


// //const User = mongoose.model('User', UserSchema);


// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   idNumber: { type: String, required: true },
//   accountNumber: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'employee', 'user'], default: 'user' } // Define roles
// });

// module.exports = mongoose.model('User', userSchema);

// // // POST route to handle registration with validation
// // app.post('/api/register', [
// //   body('accountNumber').isString().trim().escape(), //comment #3: Validate accountNumber is a string, trimmed, and escaped
// //   body('password').isString().trim().escape() //comment #3: Validate password is a string, trimmed, and escaped
// // ], async (req, res) => {
// //   const errors = validationResult(req); //comment #3: Check for validation errors
// //   if (!errors.isEmpty()) { //comment #3: If there are errors, return a 400 response with the errors
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { accountNumber, password } = req.body;

// //   try {
// //     const existingUser = await User.findOne({ accountNumber });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Account number already exists' });
// //     }

// //     const passwordHash = await bcrypt.hash(password, 10);
// //     const newUser = new User({ accountNumber, passwordHash });
// //     await newUser.save();

// //     res.status(201).json({ message: 'User registered successfully' });
// //   } catch (error) {
// //     logger.error('Error registering user:', error);
// //     res.status(500).json({ message: 'An error occurred during registration.' });
// //   }
// // });

// // Middleware to check role permissions
// function checkRolePermission(requiredRoles) {
//   return (req, res, next) => {
//     const userRole = req.user.role; // assuming req.user is populated by an authentication middleware

//     if (!requiredRoles.includes(userRole)) {
//       return res.status(403).json({ message: 'Permission denied' });
//     }
//     next();
//   };
// }

// // POST route to handle registration with validation
// app.post('/api/register', [
//   checkRolePermission(['admin', 'employee']), // Only admins and employees can register accounts
//   body('accountNumber').isString().trim().escape(),
//   body('password').isString().trim().escape(),
//   body('role').isString().trim().escape() // Validate role as a string (required for admin)
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { accountNumber, password, role } = req.body;
//   const creatorRole = req.user.role; // role of the user making the request

//   // Role-based restrictions
//   if (creatorRole === 'employee' && role !== 'user') {
//     return res.status(403).json({ message: 'Employees can only create user accounts' });
//   }

//   if (creatorRole === 'admin' && !['employee', 'user'].includes(role)) {
//     return res.status(403).json({ message: 'Admins can only create employee or user accounts' });
//   }

//   try {
//     const existingUser = await User.findOne({ accountNumber });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Account number already exists' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const newUser = new User({ accountNumber, passwordHash, role });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     logger.error('Error registering user:', error);
//     res.status(500).json({ message: 'An error occurred during registration.' });
//   }
// });

// // // POST route to handle login with validation
// // app.post('/api/login', [
// //   body('accountNumber').isString().trim().escape(), //comment #3: Validate accountNumber is a string, trimmed, and escaped
// //   body('password').isString().trim().escape() //comment #3: Validate password is a string, trimmed, and escaped
// // ], async (req, res) => {
// //   const errors = validationResult(req); //comment #3: Check for validation errors
// //   if (!errors.isEmpty()) { //comment #3: If there are errors, return a 400 response with the errors
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { accountNumber, password } = req.body;

// //   try {
// //     const user = await User.findOne({ accountNumber }); //comment #3: Safely using Mongoose query
// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     const passwordMatch = await bcrypt.compare(password, user.passwordHash);
// //     if (!passwordMatch) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign({ accountNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

// //     //comment #3: Set secure session cookie with HttpOnly and Secure flags to prevent session hijacking
// //     res.cookie('jwt', token, {
// //       httpOnly: true, // Prevent JavaScript access to the cookie
// //       secure: process.env.NODE_ENV === 'production', // Send only over HTTPS
// //       sameSite: 'Strict', // Mitigates CSRF attacks
// //       maxAge: 3600000 // 1 hour
// //     });

// //     res.status(200).json({ message: 'Login successful', token });
// //   } catch (error) {
// //     logger.error('Error during login:', error);
// //     res.status(500).json({ message: 'An error occurred during login.' });
// //   }
// // });

// // POST route to handle login with validation
// app.post('/api/login', [
//   body('accountNumber').isString().trim().escape(),
//   body('password').isString().trim().escape()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { accountNumber, password } = req.body;

//   try {
//     const user = await User.findOne({ accountNumber }); // Find the user by account number
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token including user's role
//     const token = jwt.sign(
//       { accountNumber, role: user.role }, // Include role in the token
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Set secure session cookie with HttpOnly and Secure flags to prevent session hijacking
//     res.cookie('jwt', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       maxAge: 3600000 // 1 hour
//     });

//     res.status(200).json({ message: 'Login successful', token, role: user.role });
//   } catch (error) {
//     logger.error('Error during login:', error);
//     res.status(500).json({ message: 'An error occurred during login.' });
//   }
// });

// //comment #3: Protect a route that requires the JWT token in the cookie
// app.get('/api/protected', (req, res) => {
//   const token = req.cookies.jwt; // Get token from the cookie

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({ message: 'Access granted to protected route', decoded });
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token.' });
//   }
// });

// // Serve static files from the React frontend (Uncomment if serving frontend from this backend)
// app.use(express.static('../secure-payments-portal/build'));

// // HTTPS options with SSL certificate
// const sslOptions = {
//   key: fs.readFileSync('localhost-key.pem'),
//   cert: fs.readFileSync('localhost.pem'),
//   secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1  // Disable TLS 1.0 and 1.1
// };

// // Start the HTTPS server
// if (process.env.CI !== 'true') {
//   https.createServer(sslOptions, app).listen(443, () => {
//     console.log('Server running on https://localhost');
//   });
// }

const fs = require('fs');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const constants = require('constants');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();

// Load environment variables
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Create a logger instance using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Enable CORS and security headers
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Configure Helmet with HSTS and Clickjacking protection
app.use(helmet({
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  }
}));

app.use(morgan('combined'));

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all requests
app.use(limiter);

// HTTP to HTTPS redirection middleware
app.use((req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Create User model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'user'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Middleware to check role permissions
function checkRolePermission(requiredRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
}

// POST route for admin to create account (can create 'employee' or 'user' accounts)
app.post('/api/admin/create-account', [
  checkRolePermission(['admin']),
  body('accountNumber').isString().trim().escape(),
  body('password').isString().trim().escape(),
  body('role').isString().trim().escape().isIn(['employee', 'user'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ accountNumber, password: passwordHash, role });
    await newUser.save();

    res.status(201).json({ message: 'Admin created account successfully' });
  } catch (error) {
    logger.error('Error creating account:', error);
    res.status(500).json({ message: 'An error occurred during account creation.' });
  }
});

// POST route for employee to create user account (can only create 'user' accounts)
app.post('/api/employee/create-user', [
  checkRolePermission(['employee']),
  body('accountNumber').isString().trim().escape(),
  body('password').isString().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ accountNumber, password: passwordHash, role: 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Employee created user account successfully' });
  } catch (error) {
    logger.error('Error creating user account:', error);
    res.status(500).json({ message: 'An error occurred during account creation.' });
  }
});

app.post('/api/login', [
  body('accountNumber').isString().trim().escape(),
  body('password').isString().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array()); // Log validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) {
      logger.warn('User not found:', accountNumber); // Log user not found
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      logger.warn('Invalid credentials for user:', accountNumber); // Log invalid credentials
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token including user's role
    const token = jwt.sign(
      { accountNumber, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set secure session cookie with HttpOnly and Secure flags
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });

    logger.info('Login successful for user:', accountNumber); // Log successful login
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    logger.error('Error during login:', error); // Log unexpected errors
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Protect a route that requires the JWT token in the cookie
app.get('/api/protected', (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Access granted to protected route', decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

// Serve static files from the React frontend
app.use(express.static('../secure-payments-portal/build'));

// HTTPS options with SSL certificate
const sslOptions = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
  secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1
};

// Start the HTTPS server
if (process.env.CI !== 'true') {
  https.createServer(sslOptions, app).listen(443, () => {
    console.log('Server running on https://localhost');
  });
}
