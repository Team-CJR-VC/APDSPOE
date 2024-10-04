const fs = require('fs');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan'); // For logging requests
const winston = require('winston'); // For logging errors

const app = express();

// Create a logger instance using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
});

// Enable CORS for all origins (development only)
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined')); // Log incoming requests

// Simulated users database (for demo purposes)
const users = [];

// Serve static files from the React frontend
app.use(express.static('../secure-payments-portal/build'));

// POST route to handle registration
app.post('/api/register', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    // Check if the account number already exists
    const existingUser = users.find(user => user.accountNumber === accountNumber);
    if (existingUser) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Add the new user to the users array
    users.push({ accountNumber, passwordHash });

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Error registering user:', error); // Log the error
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// POST route to handle login
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    // Find the user by account number
    const user = users.find(user => user.accountNumber === accountNumber);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If login is successful, respond with a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    logger.error('Error during login:', error); // Log the error
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// HTTPS options with SSL certificate
const sslOptions = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server running on https://localhost');
});
