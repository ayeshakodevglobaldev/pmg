const express = require('express');
const mongoose = require('mongoose');
const configService = require('./modules/config/config.service');
const fileWatcherService = require('./modules/watcher/file-watcher.service');

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

// Start the server
const PORT = configService.get('port');
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});