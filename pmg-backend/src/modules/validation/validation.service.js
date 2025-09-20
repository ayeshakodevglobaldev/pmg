class ValidationService {
    /**
     * Validate a message against predefined rules.
     * @param {Object} message - The message to validate.
     * @param {string} format - The format of the message (e.g., MX, Raast).
     * @returns {boolean} - True if the message is valid, false otherwise.
     */
    validateMessage(message, format) {
      try {
        if (format === 'MX') {
          return this.validateMxMessage(message);
        } else if (format === 'Raast') {
          return this.validateRaastMessage(message);
        } else {
          throw new Error(`Unsupported format for validation: ${format}`);
        }
      } catch (error) {
        logger.error(`Validation error: ${error.message}`);
        return false;
      }
    }
  
    // Validate SWIFT MX message
    validateMxMessage(message) {
      if (!message.Document || !message.Document.FIToFICstmrCdtTrf) {
        logger.error('Invalid MX message: Missing required fields.');
        return false;
      }
      return true;
    }
  
    // Validate Raast JSON message
    validateRaastMessage(message) {
      // Example: Check if required fields are present
      if (!message.transactionId || !message.amount || !message.beneficiary) {
        logger.error('Invalid Raast message: Missing required fields.');
        return false;
      }
      return true;
    }
  }
  
  module.exports = new ValidationService();