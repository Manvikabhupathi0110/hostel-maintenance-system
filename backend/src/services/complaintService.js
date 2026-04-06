const Complaint = require('../models/Complaint');
const SlotService = require('./slotService');

class ComplaintService {
  static async createComplaint(complaintData) {
    const complaint = await Complaint.create(complaintData);

    // Generate available slots for this complaint
    await SlotService.generateAvailableSlots(complaint.id, complaint.hostel_id);

    return complaint;
  }

  static async getComplaintById(id) {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    return complaint;
  }

  static async getStudentComplaints(student_id) {
    return Complaint.findByStudent(student_id);
  }

  static async getHostelComplaints(hostel_id, filters = {}) {
    return Complaint.findByHostel(hostel_id, filters);
  }

  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const complaint = await Complaint.updateStatus(id, status);
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    return complaint;
  }

  static async getComplaintStats(hostel_id) {
    const statuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
    const stats = {};

    for (const status of statuses) {
      stats[status] = await Complaint.countByStatus(hostel_id, status);
    }

    stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return stats;
  }
}

module.exports = ComplaintService;
