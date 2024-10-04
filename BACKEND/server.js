const fs = require('fs');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Enable CORS for all origins (development only)
app.use(cors());
app.use(express.json());
app.use(helmet());

// Simulated users database (for demo purposes)
const users = [];

// Serve static files from the React frontend
app.use(express.static('../secure-payments-portal/build'));

// POST route to handle registration
app.post('/api/register', async (req, res) => {
  const { accountNumber, password } = req.body;

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
});

// POST route to handle login
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

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
});

// HTTPS options with SSL certificate
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server running on https://localhost');
});
