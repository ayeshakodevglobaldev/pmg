const express = require('express');
const router = express.Router();
const bankController = require('../../controllers/bank.controller');

// Get all banks
router.get('/banks', bankController.getBanks);

// Add a new bank
router.post('/banks', bankController.addBank);

// Update an existing bank
router.put('/banks/:id', bankController.updateBank);

// Delete a bank
router.delete('/banks/:id', bankController.deleteBank);

module.exports = router;