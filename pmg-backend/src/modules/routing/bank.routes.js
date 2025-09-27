const express = require('express');
const router = express.Router();
const bankController = require('../../controllers/bank.controller');

const { validateBank } = require('../../shared/validation.middleware');
const upload = require('../../shared/upload.middleware');


// Get bank configuration
router.get('/bank', bankController.getBank);

// Add or update bank configuration with validation and file upload
router.post('/bank', upload.single('certificate'), validateBank, bankController.addOrUpdateBank);

// Delete bank configuration
router.delete('/bank', bankController.deleteBank);

module.exports = router;

module.exports = router;