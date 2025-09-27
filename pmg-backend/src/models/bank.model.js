const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Channel name (e.g., MT, MX)
  enabled: { type: Boolean, default: true }, // Enable/Disable toggle
  inputPath: { type: String, required: true }, // Input folder path
  outputPath: { type: String, required: true }, // Output folder path or API URL
  format: { type: String, enum: ['MT', 'MX', 'RTGS', 'RAAST'], required: true }, // File format
  credentials: {
    username: { type: String }, // Optional username
    password: { type: String }, // Optional password
    certificate: { type: String }, // Path to uploaded certificate
  },
});

const logsSchema = new mongoose.Schema({
  logPath: { type: String, required: true }, // Logs folder path
  reportPath: { type: String, required: true }, // Reports folder path
  retention: { type: Number, default: 30 }, // Retention policy in days
});

const bankSchema = new mongoose.Schema({
  bankName: { type: String, required: true }, // Bank name
  bankId: { type: String, required: true }, // Bank ID (BIC/SBP ID)
  certificate: { type: String }, // Path to uploaded certificate
  channels: [channelSchema], // Array of channels
  logs: logsSchema, // Logs & Reports setup
});

module.exports = mongoose.model('Bank', bankSchema);