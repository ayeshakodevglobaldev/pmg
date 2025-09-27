const { body, validationResult } = require('express-validator');

exports.validateBank = [
  body('bankName').notEmpty().withMessage('Bank name is required'),
  body('bankId').notEmpty().withMessage('Bank ID is required'),
  body('channels').isArray().withMessage('Channels must be an array'),
  body('logs.logPath').notEmpty().withMessage('Logs path is required'),
  body('logs.reportPath').notEmpty().withMessage('Reports path is required'),
  body('logs.retention').isInt({ min: 1 }).withMessage('Retention must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];