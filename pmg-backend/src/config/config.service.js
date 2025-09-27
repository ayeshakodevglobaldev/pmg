const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../../shared/logger.service');
class ConfigService {
  constructor() {
    this.config = {};
    this.loadConfig();
  }

  // Load configuration from config.yml or environment variables
  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'config.yml');
      if (fs.existsSync(configPath)) {
        const fileContents = fs.readFileSync(configPath, 'utf8');
        this.config = yaml.load(fileContents);
        logger.info('Configuration loaded from config.yml');
      } else {
        console.warn('config.yml not found. Falling back to environment variables.');
        this.config = {
          port: process.env.PORT || 3000,
          mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/pmg',
          inputFolder: process.env.INPUT_FOLDER || './input',
          outputFolder: process.env.OUTPUT_FOLDER || './output',
        };
      }
    } catch (error) {
      logger.error('Error loading configuration:', error);
      process.exit(1);
    }
  }

  // Get a specific configuration value
  get(key) {
    return this.config[key];
  }

  // Get all configurations
  getAll() {
    return this.config;
  }
}

module.exports = new ConfigService();