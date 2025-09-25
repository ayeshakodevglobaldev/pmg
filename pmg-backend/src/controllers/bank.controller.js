const Bank = require('../models/bank.model');

// Get all banks
exports.getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
};

// Add a new bank
exports.addBank = async (req, res) => {
  const { name, inputFolder, outputFolder } = req.body;

  try {
    const bank = new Bank({ name, inputFolder, outputFolder });
    await bank.save();
    res.status(201).json(bank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bank' });
  }
};

// Update an existing bank
exports.updateBank = async (req, res) => {
  const { id } = req.params;
  const { name, inputFolder, outputFolder } = req.body;

  try {
    const bank = await Bank.findByIdAndUpdate(
      id,
      { name, inputFolder, outputFolder },
      { new: true }
    );
    if (!bank) {
      return res.status(404).json({ error: 'Bank not found' });
    }
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bank' });
  }
};

// Delete a bank
exports.deleteBank = async (req, res) => {
  const { id } = req.params;

  try {
    const bank = await Bank.findByIdAndDelete(id);
    if (!bank) {
      return res.status(404).json({ error: 'Bank not found' });
    }
    res.status(200).json({ message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bank' });
  }
};