const WorkRecordService = require('../services/workRecordService');

class WorkRecordController {
  static async createWorkRecord(req, res) {
    try {
      const { slot_id, complaint_id, parts_used, labor_hours, notes } = req.body;

      const electrician = await require('../models/Electrician').findByUserId(req.user.id);
      if (!electrician) {
        return res.status(404).json({ success: false, message: 'Electrician profile not found' });
      }

      const workData = {
        slot_id,
        electrician_id: electrician.id,
        complaint_id,
        parts_used,
        labor_hours,
        notes,
        before_photo_url: req.files?.before_photo
          ? `/uploads/${req.files.before_photo[0].filename}`
          : null,
        after_photo_url: req.files?.after_photo
          ? `/uploads/${req.files.after_photo[0].filename}`
          : null
      };

      const workRecord = await WorkRecordService.createWorkRecord(workData);

      res.status(201).json({
        success: true,
        message: 'Work record created successfully',
        data: workRecord
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getWorkRecord(req, res) {
    try {
      const { id } = req.params;
      const workRecord = await WorkRecordService.getById(id);

      res.status(200).json({
        success: true,
        data: workRecord
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getByComplaint(req, res) {
    try {
      const { complaint_id } = req.params;
      const workRecord = await WorkRecordService.getByComplaint(complaint_id);

      res.status(200).json({
        success: true,
        data: workRecord
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getMyWorkRecords(req, res) {
    try {
      const electrician = await require('../models/Electrician').findByUserId(req.user.id);
      if (!electrician) {
        return res.status(404).json({ success: false, message: 'Electrician profile not found' });
      }

      const workRecords = await WorkRecordService.getByElectrician(electrician.id);

      res.status(200).json({
        success: true,
        data: workRecords
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateWorkRecord(req, res) {
    try {
      const { id } = req.params;
      const workRecord = await WorkRecordService.updateWorkRecord(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Work record updated',
        data: workRecord
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = WorkRecordController;
