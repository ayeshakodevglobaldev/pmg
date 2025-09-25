const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  inputFolder: { type: String, required: true },
  outputFolder: { type: String, required: true },
});

module.exports = mongoose.model('Bank', bankSchema);