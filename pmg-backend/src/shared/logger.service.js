const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json() // Logs in JSON format for structured logging
  ),
  transports: [
    new transports.Console({ format: logFormat }), // Logs to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to a file
    new transports.File({ filename: 'logs/combined.log' }), // Logs all events to a file
  ],
});

module.exports = logger;