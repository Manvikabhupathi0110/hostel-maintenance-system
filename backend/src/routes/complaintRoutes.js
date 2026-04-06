const express = require('express');
const { body } = require('express-validator');
const ComplaintController = require('../controllers/complaintController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

const router = express.Router();

const complaintValidation = [
  body('room_id').isInt().withMessage('Valid room ID is required'),
  body('hostel_id').isInt().withMessage('Valid hostel ID is required'),
  body('issue_description').trim().notEmpty().withMessage('Issue description is required'),
  body('category').optional().isIn(['lighting', 'fan', 'switch', 'wiring', 'appliance', 'general']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
];

router.post('/', authMiddleware, uploadSingle, complaintValidation, ComplaintController.createComplaint);
router.get('/student/my-complaints', authMiddleware, ComplaintController.getStudentComplaints);
router.get('/hostel/:hostel_id', authMiddleware, ComplaintController.getHostelComplaints);
router.get('/:id', authMiddleware, ComplaintController.getComplaint);
router.patch('/:id/status', authMiddleware, ComplaintController.updateComplaintStatus);

module.exports = router;