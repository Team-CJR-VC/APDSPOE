const fs = require('fs');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const app = express();

// Apply security headers using Helmet
app.use(helmet());

// Serve static files from the React frontend
app.use(express.static('../secure-payments-portal/build'));

// Define a basic API route (example)
app.get('/api/data', (req, res) => {
  res.json({ message: 'Secure data' });
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
