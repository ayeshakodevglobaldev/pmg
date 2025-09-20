const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const configService = require("../config/config.service");
const transformationService = require("../transformation/transformation.service");
const validationService = require("../validation/validation.service");
const xml2js = require('xml2js'); // Import xml2js for parsing

const integrationService = require("../integration/integration.service");

class FileWatcherService {
  constructor() {
    this.watchers = [];
  }

  // Start watching input folders
  startWatching() {
    const banks = configService.get("banks");
    if (!banks || banks.length === 0) {
      console.warn("No banks configured for file watching.");
      return;
    }

    banks.forEach((bank) => {
      const inputFolder = path.resolve(bank.inputFolder);
      console.log(`Starting to watch folder: ${inputFolder}`);

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
    console.log(`New file detected for ${bank.name}: ${filePath}`);

    try {
      // Example: Transform MT to MX
      const transformedMessage = await transformationService.transformMessage(
        filePath,
        "MT", // Source format
        "MX" // Target format
      );

      console.log(`Transformed message for ${bank.name}:`);
      console.log(transformedMessage);

      // Parse the transformed XML into a JavaScript object
      const parser = new xml2js.Parser({ explicitArray: false });
      const parsedMessage = await parser.parseStringPromise(transformedMessage);

      console.log(`Parsed MX message for validation:`, parsedMessage);

      // Validate the parsed message
      const isValid = validationService.validateMessage(
        parsedMessage,
        "MX"
      );
      if (!isValid) {
        console.error(`Validation failed for ${bank.name}: ${filePath}`);
        return;
      }

      // Send the message to Raast API
      const raastResponse = await integrationService.sendToRaastApi(
        parsedMessage
      );
      console.log(`Raast API response for ${bank.name}:`, raastResponse);

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
      console.log(`Transformed message saved to: ${outputFilePath}`);
    } catch (error) {
      console.error(`Error processing file for ${bank.name}: ${error.message}`);
    }
  }

  // Stop all watchers
  stopWatching() {
    this.watchers.forEach((watcher) => watcher.close());
    console.log("Stopped all file watchers.");
  }
}

module.exports = new FileWatcherService();
