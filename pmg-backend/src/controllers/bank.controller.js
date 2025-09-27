const Bank = require("../models/bank.model");
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
// Utility function to create a folder if it doesn't exist
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

exports.getBank = async (req, res) => {
  try {
    const bank = await Bank.findOne(); // Fetch the single bank configuration
    if (!bank) {
      return res.status(404).json({ error: "No bank configuration found" });
    }
    res.status(200).json(bank);
  } catch (error) {
    console.error("Error fetching bank configuration:", error);
    res.status(500).json({ error: "Failed to fetch bank configuration" });
  }
};



exports.addOrUpdateBank = async (req, res) => {
  const { bankName, bankId, certificate, channels, logs } = req.body;

  try {
    // Create folders for channels
    channels.forEach((channel) => {
      createFolderIfNotExists(channel.inputPath);
      createFolderIfNotExists(channel.outputPath);
    });

    // Create folders for logs and reports
    createFolderIfNotExists(logs.logPath);
    createFolderIfNotExists(logs.reportPath);

    // Save or update the bank configuration in the database
    const bankConfig = await Bank.findOneAndUpdate(
      {}, // Match the single bank configuration
      { bankName, bankId, certificate, channels, logs },
      { upsert: true, new: true } // Create if not exists, return the updated document
    );

    // Generate the config.yml file
    const config = {
      bankName,
      bankId,
      certificate,
      channels,
      logs,
    };

    const configFolderPath = path.join(__dirname, '../config');
    createFolderIfNotExists(configFolderPath); // Ensure the config folder exists
    

    const configPath = path.join(__dirname, '../config/config.yml'); // Save under src/modules/config
    const yamlData = yaml.dump(config);
    fs.writeFileSync(configPath, yamlData);

    res.status(201).json(bankConfig);
  } catch (error) {
    console.error("Error adding/updating bank configuration:", error);
    res
      .status(500)
      .json({ error: "Failed to add or update bank configuration" });
  }
};

exports.deleteBank = async (req, res) => {
  try {
    await Bank.deleteOne({});
    res
      .status(200)
      .json({ message: "Bank configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank configuration:", error);
    res.status(500).json({ error: "Failed to delete bank configuration" });
  }
};
