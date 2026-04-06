const pool = require('../config/database');
const Slot = require('../models/Slot');
const Complaint = require('../models/Complaint');

class SlotService {
  /**
   * Generate available slots for a complaint
   * Time slots: Mon-Fri after 4 PM, Weekends 9 AM-5 PM
   */
  static async generateAvailableSlots(complaint_id, hostel_id, days = 7) {
    try {
      // Get room_id from the complaint
      const complaintQuery = 'SELECT room_id FROM complaints WHERE id = $1';
      const complaintResult = await pool.query(complaintQuery, [complaint_id]);
      if (complaintResult.rows.length === 0) {
        throw new Error('Complaint not found');
      }
      const room_id = complaintResult.rows[0].room_id;

      const slots = [];
      const startDate = new Date();

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        // Skip Sunday
        if (currentDate.getDay() === 0) continue;

        const dayOfWeek = currentDate.getDay();
        const dateStr = currentDate.toISOString().split('T')[0];

        let timeSlots = [];

        if (dayOfWeek === 6) {
          // Saturday: 9 AM to 5 PM
          timeSlots = this.generateTimeSlots('09:00', '17:00', 60); // 1-hour slots
        } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          // Monday to Friday: 4 PM to 6 PM (only 2 hours available)
          timeSlots = this.generateTimeSlots('16:00', '18:00', 60);
        }

        for (const [startTime, endTime] of timeSlots) {
          slots.push({
            complaint_id,
            hostel_id,
            room_id,
            slot_date: dateStr,
            slot_start_time: startTime,
            slot_end_time: endTime,
          });
        }
      }

      if (slots.length === 0) {
        return [];
      }

      // Insert slots into database (6 params per slot)
      const placeholders = slots
        .map((_, i) =>
          `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
        )
        .join(',');

      const query = `
        INSERT INTO slots 
        (complaint_id, hostel_id, room_id, slot_date, slot_start_time, slot_end_time)
        VALUES ${placeholders}
        RETURNING *;
      `;

      const params = slots.flatMap(s => [
        s.complaint_id, s.hostel_id, s.room_id, s.slot_date, s.slot_start_time, s.slot_end_time
      ]);

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to generate slots: ${error.message}`);
    }
  }

  /**
   * Generate time slots between start and end time with interval in minutes
   */
  static generateTimeSlots(startTime, endTime, intervalMinutes = 60) {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + intervalMinutes <= endMinutes) {
      const slotStart = this.minutesToTimeString(currentMinutes);
      const slotEnd = this.minutesToTimeString(currentMinutes + intervalMinutes);
      slots.push([slotStart, slotEnd]);
      currentMinutes += intervalMinutes;
    }

    return slots;
  }

  static minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Assign electrician to a slot with constraint checking
   * Constraint: No electrician should be assigned to 2 different hostels on same day
   */
  static async assignElectricianToSlot(slot_id, electrician_id) {
    try {
      // Get slot details
      const slotQuery = 'SELECT * FROM slots WHERE id = $1';
      const slotResult = await pool.query(slotQuery, [slot_id]);
      if (slotResult.rows.length === 0) {
        throw new Error('Slot not found');
      }

      const slot = slotResult.rows[0];

      // Check if electrician has assignment in different hostel on same day
      const conflictQuery = `
        SELECT DISTINCT h.id, h.name
        FROM slots s
        JOIN hostels h ON s.hostel_id = h.id
        WHERE s.electrician_id = $1 
        AND s.slot_date = $2 
        AND s.status IN ('booked', 'in_progress')
        AND h.id != $3
        LIMIT 1;
      `;

      const conflictResult = await pool.query(conflictQuery, [
        electrician_id,
        slot.slot_date,
        slot.hostel_id
      ]);

      if (conflictResult.rows.length > 0) {
        throw new Error(
          `Electrician already assigned to ${conflictResult.rows[0].name} on this date. Cannot assign to multiple hostels.`
        );
      }

      // Check for time overlaps in the same hostel
      const overlapQuery = `
        SELECT * FROM slots
        WHERE electrician_id = $1 
        AND hostel_id = $2
        AND slot_date = $3
        AND status IN ('booked', 'in_progress')
        AND id != $4
        AND (
          (slot_start_time, slot_end_time) OVERLAPS ($5::time, $6::time)
        );
      `;

      const overlapResult = await pool.query(overlapQuery, [
        electrician_id,
        slot.hostel_id,
        slot.slot_date,
        slot_id,
        slot.slot_start_time,
        slot.slot_end_time
      ]);

      if (overlapResult.rows.length > 0) {
        throw new Error('Electrician has overlapping slot at this time');
      }

      // Assign electrician to slot
      return await Slot.assignElectrician(slot_id, electrician_id);
    } catch (error) {
      throw new Error(`Failed to assign electrician: ${error.message}`);
    }
  }

  /**
   * Get available electricians for a slot
   */
  static async getAvailableElectricians(slot_id) {
    try {
      const slotQuery = 'SELECT * FROM slots WHERE id = $1';
      const slotResult = await pool.query(slotQuery, [slot_id]);
      if (slotResult.rows.length === 0) {
        throw new Error('Slot not found');
      }

      const slot = slotResult.rows[0];

      // Find electricians who:
      // 1. Are available
      // 2. Don't have assignments to different hostels on this date
      // 3. Don't have time overlaps
      const query = `
        SELECT DISTINCT e.*, u.name, u.email, u.phone
        FROM electricians e
        JOIN users u ON e.user_id = u.id
        WHERE e.availability_status = 'available'
        AND u.status = 'active'
        AND e.id NOT IN (
          SELECT DISTINCT electrician_id FROM slots
          WHERE slot_date = $1
          AND hostel_id != $2
          AND status IN ('booked', 'in_progress')
          AND electrician_id IS NOT NULL
        )
        AND e.id NOT IN (
          SELECT DISTINCT electrician_id FROM slots
          WHERE slot_date = $1
          AND hostel_id = $2
          AND status IN ('booked', 'in_progress')
          AND electrician_id IS NOT NULL
          AND (slot_start_time, slot_end_time) OVERLAPS ($3::time, $4::time)
        )
        ORDER BY e.average_rating DESC;
      `;

      const result = await pool.query(query, [
        slot.slot_date,
        slot.hostel_id,
        slot.slot_start_time,
        slot.slot_end_time
      ]);

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get available electricians: ${error.message}`);
    }
  }

  /**
   * Auto-assign best available electrician to slot
   */
  static async autoAssignBestElectrician(slot_id) {
    try {
      const availableElectricians = await this.getAvailableElectricians(slot_id);

      if (availableElectricians.length === 0) {
        throw new Error('No available electricians for this slot');
      }

      // Pick electrician with highest rating
      const best = availableElectricians[0];
      return await this.assignElectricianToSlot(slot_id, best.id);
    } catch (error) {
      throw new Error(`Failed to auto-assign electrician: ${error.message}`);
    }
  }
}

module.exports = SlotService;
