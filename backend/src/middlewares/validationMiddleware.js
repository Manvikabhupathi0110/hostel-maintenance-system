const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['student', 'electrician', 'warden', 'admin'])
    .withMessage('Invalid role'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const complaintValidation = [
  body('room_id').isInt({ min: 1 }).withMessage('Valid room ID is required'),
  body('hostel_id').isInt({ min: 1 }).withMessage('Valid hostel ID is required'),
  body('issue_description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Issue description must be at least 10 characters'),
  body('category')
    .optional()
    .isIn(['lighting', 'fan', 'switch', 'wiring', 'appliance', 'general'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

const ratingValidation = [
  body('work_record_id').isInt({ min: 1 }).withMessage('Valid work record ID is required'),
  body('electrician_id').isInt({ min: 1 }).withMessage('Valid electrician ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review too long')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  complaintValidation,
  ratingValidation
};
