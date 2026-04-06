const express = require('express');
const { body } = require('express-validator');
const RatingController = require('../controllers/ratingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['student']),
  [
    body('work_record_id').isInt().withMessage('Valid work record ID is required'),
    body('electrician_id').isInt().withMessage('Valid electrician ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim()
  ],
  RatingController.createRating
);

router.get('/electrician/:electrician_id', authMiddleware, RatingController.getElectricianRatings);
router.get('/:id', authMiddleware, RatingController.getRating);

module.exports = router;
