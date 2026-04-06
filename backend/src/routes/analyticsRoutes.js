const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

const adminOrWarden = roleMiddleware(['admin', 'warden']);

router.get('/stats', authMiddleware, adminOrWarden, AnalyticsController.getOverallStats);
router.get('/complaints/by-category', authMiddleware, adminOrWarden, AnalyticsController.getComplaintsByCategory);
router.get('/complaints/by-status', authMiddleware, adminOrWarden, AnalyticsController.getComplaintsByStatus);
router.get('/complaints/trends', authMiddleware, adminOrWarden, AnalyticsController.getComplaintTrends);
router.get('/electricians/top', authMiddleware, adminOrWarden, AnalyticsController.getTopElectricians);
router.get('/hostels', authMiddleware, adminOrWarden, AnalyticsController.getHostelStats);

module.exports = router;
