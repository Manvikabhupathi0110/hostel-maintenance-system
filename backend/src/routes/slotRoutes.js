const express = require('express');
const { body, query } = require('express-validator');
const SlotController = require('../controllers/slotController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

const slotValidation = [
  body('slot_id').isInt().withMessage('Valid slot ID is required'),
  body('electrician_id').isInt().withMessage('Valid electrician ID is required')
];

router.get('/available', SlotController.getAvailableSlots);
router.get('/my-slots', authMiddleware, SlotController.getMySlots);
router.post('/book', authMiddleware, slotValidation, SlotController.bookSlot);
router.post('/auto-assign', authMiddleware, SlotController.autoAssignElectrician);
router.get('/:id', authMiddleware, SlotController.getSlotDetails);
router.get('/:id/electricians', authMiddleware, SlotController.getAvailableElectricians);
router.patch('/:id/status', authMiddleware, SlotController.updateSlotStatus);

module.exports = router;