const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const configService = require("../config/config.service");
const transformationService = require("../transformation/transformation.service");
const validationService = require("../validation/validation.service");
const xml2js = require('xml2js'); // Import xml2js for parsing
const logger = require('../../shared/logger.service');
const integrationService = require("../integration/integration.service");
const monitoringService = require('../../shared/monitoring.service');


class FileWatcherService {
  constructor() {
    this.watchers = [];
  }

  // Start watching input folders
  startWatching() {
    const banks = configService.get("banks");
    if (!banks || banks.length === 0) {
      logger.warn('No banks configured for file watching.');
      return;
    }

    banks.forEach((bank) => {
      const inputFolder = path.resolve(bank.inputFolder);
      logger.info(`Starting to watch folder: ${inputFolder}`);

      const watcher = chokidar.watch(inputFolder, {
        persistent: true,
        ignoreInitial: true,
      });

      watcher
        .on("add", (filePath) => this.onFileAdded(filePath, bank))
        .on("error", (error) => console.error(`Watcher error: ${error}`));

      this.watchers.push(watcher);
    });
  }

  // Handle new files
  async onFileAdded(filePath, bank) {
    logger.info(`New file detected for ${bank.name}: ${filePath}`);
    const startTime = Date.now(); // Start timer for processing time
    try {
      // Example: Transform MT to MX
      const transformedMessage = await transformationService.transformMessage(
        filePath,
        "MT", // Source format
        "MX" // Target format
      );

      logger.info(`Transformed message for ${bank.name}:`, { transformedMessage });
      

      // Parse the transformed XML into a JavaScript object
      const parser = new xml2js.Parser({ explicitArray: false });
      const parsedMessage = await parser.parseStringPromise(transformedMessage);

      logger.info(`Parsed MX message for validation:`, parsedMessage);

      // Validate the parsed message
      const isValid = validationService.validateMessage(
        parsedMessage,
        "MX"
      );
      if (!isValid) {
        logger.warn(`Validation failed for ${bank.name}: ${filePath}`);
        monitoringService.processedMessages.inc({ status: 'failed' }); // Increment failure count
        return;
      }

      // Send the message to Raast API
      const raastResponse = await integrationService.sendToRaastApi(
        parsedMessage
      );
      logger.info(`Raast API response for ${bank.name}:`, raastResponse);

      // Optionally, publish the message to RabbitMQ
      await integrationService.publishToRabbitMq(
        "payment-messages",
        parsedMessage
      );

      // Save the transformed message to the output folder
      const outputFolder = path.resolve(bank.outputFolder);
      const outputFilePath = path.join(
        outputFolder,
        path.basename(filePath, ".txt") + "-transformed.xml"
      );
      fs.writeFileSync(outputFilePath, transformedMessage, "utf8");
      logger.info(`Transformed message saved to: ${outputFilePath}`);
      monitoringService.processedMessages.inc({ status: 'success' }); // Increment success count
    } catch (error) {
      logger.error(`Error processing file for ${bank.name}: ${error.message}`);
      monitoringService.processedMessages.inc({ status: 'failed' }); // Increment failure count
    } finally {
      const processingTime = (Date.now() - startTime) / 1000; // Calculate processing time in seconds
      monitoringService.messageProcessingTime.observe(processingTime); // Record processing time
    }
  }

  // Stop all watchers
  stopWatching() {
    this.watchers.forEach((watcher) => watcher.close());
    logger.info('Stopped all file watchers.');
  }
}

module.exports = new FileWatcherService();
