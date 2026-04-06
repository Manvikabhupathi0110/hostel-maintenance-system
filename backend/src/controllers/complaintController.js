const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const SlotService = require('../services/slotService');

class ComplaintController {
  static async createComplaint(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { room_id, hostel_id, issue_description, category, priority } = req.body;
      const student_id = req.user.id;

      const complaintData = {
        room_id,
        student_id,
        hostel_id,
        issue_description,
        category: category || 'general',
        priority: priority || 'medium',
        issue_photo_url: req.file ? `/uploads/${req.file.filename}` : null
      };

      const complaint = await Complaint.create(complaintData);

      // Generate available slots for this complaint
      await SlotService.generateAvailableSlots(complaint.id, hostel_id);

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getComplaint(req, res) {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getStudentComplaints(req, res) {
    try {
      const student_id = req.user.id;
      const complaints = await Complaint.findByStudent(student_id);

      res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getHostelComplaints(req, res) {
    try {
      const { hostel_id } = req.params;
      const { status, limit, offset } = req.query;

      const filters = {
        status,
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0
      };

      const complaints = await Complaint.findByHostel(hostel_id, filters);

      res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateComplaintStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const complaint = await Complaint.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Complaint status updated',
        data: complaint
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ComplaintController;