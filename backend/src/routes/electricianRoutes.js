const express = require('express');
const { body } = require('express-validator');
const ElectricianController = require('../controllers/electricianController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', ElectricianController.getAllElectricians);
router.get('/me', authMiddleware, roleMiddleware(['electrician']), ElectricianController.getMyProfile);
router.get('/me/stats', authMiddleware, roleMiddleware(['electrician']), ElectricianController.getStats);
router.get('/:id', ElectricianController.getElectrician);

router.patch(
  '/:id/availability',
  authMiddleware,
  roleMiddleware(['electrician', 'warden', 'admin']),
  [body('availability_status').isIn(['available', 'busy', 'on_leave'])],
  ElectricianController.updateAvailability
);

router.put(
  '/me/profile',
  authMiddleware,
  roleMiddleware(['electrician']),
  ElectricianController.updateProfile
);

module.exports = router;
