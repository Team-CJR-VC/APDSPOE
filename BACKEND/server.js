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

const app = express();

// Load environment variables
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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
// Configure Helmet with HSTS headers
app.use(helmet({
  hsts: {
    maxAge: 63072000,  // 2 years in seconds
    includeSubDomains: true,  // Apply to subdomains
    preload: true  // Allow browsers to preload HSTS settings
  }
}));
app.use(morgan('combined')); // Log incoming requests

// HTTP to HTTPS redirection middleware
app.use((req, res, next) => {
  if (req.secure) {
    // Already HTTPS, continue
    return next();
  } else {
    // Redirect HTTP to HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Create a User model
const UserSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// POST route to handle registration
app.post('/api/register', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ accountNumber, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// POST route to handle login
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

     // Generate JWT token
     const token = jwt.sign({ accountNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Serve static files from the React frontend (Uncomment if serving frontend from this backend)
app.use(express.static('../secure-payments-portal/build'));

// HTTPS options with SSL certificate
const sslOptions = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
  secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1  // Disable TLS 1.0 and 1.1
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server running on https://localhost');
});
