const client = require('prom-client');

// Create a Registry to register metrics
const register = new client.Registry();

// Default metrics (e.g., memory usage, CPU usage)
client.collectDefaultMetrics({ register });

// Custom metrics
const processedMessages = new client.Counter({
  name: 'processed_messages_total',
  help: 'Total number of processed messages',
  labelNames: ['status'], // Labels for success or failure
});

const messageProcessingTime = new client.Histogram({
  name: 'message_processing_time_seconds',
  help: 'Histogram of message processing times',
  buckets: [0.1, 0.5, 1, 2, 5], // Buckets for response times
});

// Register custom metrics
register.registerMetric(processedMessages);
register.registerMetric(messageProcessingTime);

module.exports = {
  register,
  processedMessages,
  messageProcessingTime,
};