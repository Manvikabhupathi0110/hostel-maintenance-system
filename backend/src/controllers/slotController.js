const { validationResult } = require('express-validator');
const Slot = require('../models/Slot');
const SlotService = require('../services/slotService');

class SlotController {
  static async getMySlots(req, res) {
    try {
      const student_id = req.user.id;
      const slots = await Slot.findByStudent(student_id);

      res.status(200).json({
        success: true,
        data: slots
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAvailableSlots(req, res) {
    try {
      const { hostel_id, date } = req.query;

      const filters = { date };
      const slots = await Slot.getAvailableSlots(hostel_id, filters);

      res.status(200).json({
        success: true,
        data: slots
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async bookSlot(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { slot_id, electrician_id } = req.body;

      // Assign electrician with constraint checking
      const slot = await SlotService.assignElectricianToSlot(slot_id, electrician_id);

      res.status(200).json({
        success: true,
        message: 'Slot booked successfully',
        data: slot
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async autoAssignElectrician(req, res) {
    try {
      const { slot_id } = req.body;

      const slot = await SlotService.autoAssignBestElectrician(slot_id);

      res.status(200).json({
        success: true,
        message: 'Electrician assigned automatically',
        data: slot
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getSlotDetails(req, res) {
    try {
      const { id } = req.params;
      const slot = await Slot.findById(id);

      if (!slot) {
        return res.status(404).json({
          success: false,
          message: 'Slot not found'
        });
      }

      res.status(200).json({
        success: true,
        data: slot
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAvailableElectricians(req, res) {
    try {
      const { slot_id } = req.params;

      const electricians = await SlotService.getAvailableElectricians(slot_id);

      res.status(200).json({
        success: true,
        data: electricians
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateSlotStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['available', 'booked', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const slot = await Slot.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Slot status updated',
        data: slot
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = SlotController;