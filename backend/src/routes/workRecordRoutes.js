const express = require('express');
const { body } = require('express-validator');
const WorkRecordController = require('../controllers/workRecordController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { uploadFields } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['electrician']),
  uploadFields,
  WorkRecordController.createWorkRecord
);

router.get('/me', authMiddleware, roleMiddleware(['electrician']), WorkRecordController.getMyWorkRecords);
router.get('/complaint/:complaint_id', authMiddleware, WorkRecordController.getByComplaint);
router.get('/:id', authMiddleware, WorkRecordController.getWorkRecord);
router.patch('/:id', authMiddleware, roleMiddleware(['electrician']), WorkRecordController.updateWorkRecord);

module.exports = router;
