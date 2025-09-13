const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const configService = require("../config/config.service");
const transformationService = require("../transformation/transformation.service");
const validationService = require("../validation/validation.service");
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

      // Validate the transformed message
      const isValid = validationService.validateMessage(
        transformedMessage,
        "MX"
      );
      if (!isValid) {
        console.error(`Validation failed for ${bank.name}: ${filePath}`);
        return;
      }

      // Send the message to Raast API
      const raastResponse = await integrationService.sendToRaastApi(
        transformedMessage
      );
      console.log(`Raast API response for ${bank.name}:`, raastResponse);

      // Optionally, publish the message to RabbitMQ
      await integrationService.publishToRabbitMq(
        "payment-messages",
        transformedMessage
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
