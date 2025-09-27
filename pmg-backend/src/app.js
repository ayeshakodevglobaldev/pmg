const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
const configService = require('./modules/config/config.service');
const fileWatcherService = require('./modules/watcher/file-watcher.service');
const authorize = require('./shared/rbac.middleware');
const ROLES = require('./shared/roles');
const logger = require('./shared/logger.service');
const monitoringService = require('./shared/monitoring.service');
const cors = require('cors');
const bankRoutes = require('./modules/routing/bank.routes');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Example: Restrict CORS to specific origins (optional)
const corsOptions = {
  origin: ['http://localhost:4200','http://localhost:3001'], // Replace with your Angular frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(configService.get('mongoUri'), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', bankRoutes);

// Start the Dynamic File Watcher
fileWatcherService.startWatching();

// Default route
app.get('/', (req, res) => {
  logger.info('Default route accessed');
  res.send('Payment Messaging Gateway Backend is running!');
});

// // Example protected route for Admins
// app.get('/admin', authorize([ROLES.ADMIN]), (req, res) => {
//   res.send('Welcome, Admin! You have full access.');
// });

// // Example protected route for Operators
// app.get('/logs', authorize([ROLES.ADMIN, ROLES.OPERATOR]), (req, res) => {
//   res.send('Here are the logs.');
// });

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', monitoringService.register.contentType);
    res.end(await monitoringService.register.metrics());
  } catch (err) {
    res.status(500).send('Error collecting metrics');
  }
});

//Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('./src/certs/server.key'),
  cert: fs.readFileSync('./src/certs/server.cert'),
};

// Start the server
const PORT = configService.get('port') || 3000;

https.createServer(sslOptions,app).listen(PORT, () => {
  logger.info(`Secure server is running on https://localhost:${PORT}`);
});