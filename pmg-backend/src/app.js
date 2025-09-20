const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
const configService = require('./modules/config/config.service');
const fileWatcherService = require('./modules/watcher/file-watcher.service');
const authorize = require('./shared/rbac.middleware');
const ROLES = require('./shared/roles');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(configService.get('mongoUri'), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the Dynamic File Watcher
fileWatcherService.startWatching();

// Default route
app.get('/', (req, res) => {
  res.send('Payment Messaging Gateway Backend is running!');
});

// Example protected route for Admins
app.get('/admin', authorize([ROLES.ADMIN]), (req, res) => {
  res.send('Welcome, Admin! You have full access.');
});

// Example protected route for Operators
app.get('/logs', authorize([ROLES.ADMIN, ROLES.OPERATOR]), (req, res) => {
  res.send('Here are the logs.');
});

//Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('./src/certs/server.key'),
  cert: fs.readFileSync('./src/certs/server.cert'),
};

// Start the server
const PORT = configService.get('port') || 3000;

https.createServer(sslOptions,app).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});