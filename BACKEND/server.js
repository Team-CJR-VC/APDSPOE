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

//Seed Admin Account
async function seedAdmin() {
  try {
    const adminAccountNumber = process.env.ADMIN_ACCOUNT_NUMBER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if an admin account already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    // Hash the password and create the admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      fullName: 'Admin',
      idNumber: '0000000000000',
      accountNumber: adminAccountNumber,
      passwordHash: passwordHash,
      roles: ['admin', 'employee']
    });

    await adminUser.save();
    console.log(`Admin account created with account number: ${adminAccountNumber}`);
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
}

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    seedAdmin(); // Seed admin after MongoDB connection is established
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
app.use(cors({origin: "http://localhost:3000"}));
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
    const host = process.env.HOST || req.hostname;
    res.redirect(`https://${host}${req.originalUrl}`);
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

//Create Payment model
// const paymentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   accountInfo: { type: String, required: true },
//   swiftCode: { type: String, required: true },
//   date: { type: Date, default: Date.now },
// });
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  accountInfo: { type: String, required: true },
  swiftCode: { type: String, required: true },
  status: { type: String, default: 'pending' },  // New status field
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

// Middleware to check role permissions
function checkRolePermission(requiredRoles) {
  return (req, res, next) => {
    console.log(req.body);
    const userRole = req.user.role;
    console.log(userRole);

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('backend: '+authHeader);

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer "

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //req.user = decoded;  // Assign decoded token to req.user
      req.user = { id: decoded.id, accountNumber: decoded.accountNumber, role: decoded.role };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
}

app.post('/api/admin/create-account', authenticateJWT, checkRolePermission(['admin']), [
  body('fullName').isString().trim().escape(),
  body('idNumber').isString().trim().escape(),
  body('accountNumber').isString().trim().escape(),
  body('password').isString().trim().escape(),
  body('role').isString().trim().escape().isIn(['employee', 'user'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, idNumber, accountNumber, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    // Hash the password and store it
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      passwordHash,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'Admin created account successfully' });
  } catch (error) {
    logger.error('Error creating account:', error);
    res.status(500).json({ message: 'An error occurred during account creation.' });
  }
});

// POST route for employee to create user account (can only create 'user' accounts)
app.post('/api/employee/create-user', authenticateJWT, checkRolePermission(['employee']), [
  body('fullName').isString().trim().escape(),
  body('idNumber').isString().trim().escape(),
  body('accountNumber').isString().trim().escape(),
  body('password').isString().trim().escape(),
  body('role').isString().trim().escape().isIn(['user'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, idNumber, accountNumber, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      passwordHash,
      role: 'user'
    });
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
      { id: user._id, accountNumber: user.accountNumber, role: user.role },
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

// POST /api/payments - Create a new payment
app.post('/api/payments', authenticateJWT, async (req, res) => {
  const { amount, currency, accountInfo, swiftCode, status } = req.body;

  try {
    const payment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      accountInfo,
      swiftCode,
      status
    });
    await payment.save();
    res.status(201).json({ message: 'Payment saved successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error saving payment', error });
  }
});

// GET /api/payments - Get all payments for the logged-in user
app.get('/api/payments', authenticateJWT, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
});

// GET /api/admin/payments - Get all payments with user info (full name and account number)
app.get('/api/admin/payments', authenticateJWT, async (req, res) => {
  try {
    // Fetch all payments and include user details (fullName, accountNumber)
    const payments = await Payment.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',  // assuming `userId` is the foreign key in the Payment collection
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'  // Deconstruct the array returned by $lookup
      },
      {
        $project: {
          amount: 1,
          currency: 1,
          accountInfo: 1,
          swiftCode: 1,
          createdAt: 1,
          'userDetails.fullName': 1,
          'userDetails.accountNumber': 1,
          status: 1
        }
      }
    ]);

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
});

// Approve payment
app.put('/api/admin/payments/:id/approve', authenticateJWT, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'approved';  // Update status to approved
    await payment.save();

    res.status(200).json({ message: 'Payment approved successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving payment', error });
  }
});

// Deny payment
app.put('/api/admin/payments/:id/deny', authenticateJWT, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'denied';  // Update status to denied
    await payment.save();

    res.status(200).json({ message: 'Payment denied successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error denying payment', error });
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
