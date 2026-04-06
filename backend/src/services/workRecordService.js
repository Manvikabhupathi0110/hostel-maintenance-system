const WorkRecord = require('../models/WorkRecord');
const Slot = require('../models/Slot');
const Complaint = require('../models/Complaint');
const Electrician = require('../models/Electrician');

class WorkRecordService {
  static async createWorkRecord(workData) {
    // Update slot status to completed
    await Slot.updateStatus(workData.slot_id, 'completed');

    // Update complaint status to completed
    await Complaint.updateStatus(workData.complaint_id, 'completed');

    // Create work record
    const workRecord = await WorkRecord.create(workData);

    // Update electrician stats
    await Electrician.updateRating(workData.electrician_id);

    return workRecord;
  }

  static async getById(id) {
    const workRecord = await WorkRecord.findById(id);
    if (!workRecord) {
      throw new Error('Work record not found');
    }
    return workRecord;
  }

  static async getByComplaint(complaint_id) {
    return WorkRecord.findByComplaint(complaint_id);
  }

  static async getByElectrician(electrician_id) {
    return WorkRecord.findByElectrician(electrician_id);
  }

  static async updateWorkRecord(id, updates) {
    const workRecord = await WorkRecord.update(id, updates);
    if (!workRecord) {
      throw new Error('Work record not found or no valid fields to update');
    }
    return workRecord;
  }
}

module.exports = WorkRecordService;
