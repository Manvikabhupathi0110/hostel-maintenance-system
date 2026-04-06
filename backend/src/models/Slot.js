const pool = require('../config/database');

class Slot {
  static async create(slotData) {
    const {
      complaint_id, electrician_id, hostel_id, room_id, slot_date, slot_start_time, slot_end_time
    } = slotData;

    const query = `
      INSERT INTO slots 
      (complaint_id, electrician_id, hostel_id, room_id, slot_date, slot_start_time, slot_end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'booked')
      RETURNING *;
    `;

    const result = await pool.query(query, [
      complaint_id, electrician_id, hostel_id, room_id, slot_date, slot_start_time, slot_end_time
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT s.*, e.user_id as electrician_user_id, u.name as electrician_name, 
             c.issue_description, r.room_number, h.name as hostel_name
      FROM slots s
      LEFT JOIN electricians e ON s.electrician_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      JOIN complaints c ON s.complaint_id = c.id
      JOIN rooms r ON s.room_id = r.id
      JOIN hostels h ON s.hostel_id = h.id
      WHERE s.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAvailableSlots(hostel_id, filters = {}) {
    let query = `
      SELECT s.*, r.room_number, h.name as hostel_name,
             c.issue_description
      FROM slots s
      JOIN complaints c ON s.complaint_id = c.id
      JOIN rooms r ON s.room_id = r.id
      JOIN hostels h ON s.hostel_id = h.id
      WHERE s.status = 'available'
    `;

    const params = [];
    let paramCount = 1;

    if (hostel_id) {
      query += ` AND s.hostel_id = $${paramCount}`;
      params.push(hostel_id);
      paramCount++;
    }

    if (filters.date) {
      query += ` AND s.slot_date = $${paramCount}`;
      params.push(filters.date);
      paramCount++;
    }

    query += ' ORDER BY s.slot_date, s.slot_start_time';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findByStudent(student_id) {
    const query = `
      SELECT s.*, r.room_number, h.name as hostel_name,
             c.issue_description,
             u.name as electrician_name
      FROM slots s
      JOIN complaints c ON s.complaint_id = c.id
      JOIN rooms r ON s.room_id = r.id
      JOIN hostels h ON s.hostel_id = h.id
      LEFT JOIN electricians e ON s.electrician_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE c.student_id = $1
      ORDER BY s.slot_date DESC, s.slot_start_time DESC;
    `;
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }

  static async getElectricianSchedule(electrician_id, date) {
    const query = `
      SELECT s.*, c.issue_description, r.room_number, h.name as hostel_name
      FROM slots s
      JOIN complaints c ON s.complaint_id = c.id
      JOIN rooms r ON s.room_id = r.id
      JOIN hostels h ON s.hostel_id = h.id
      WHERE s.electrician_id = $1 AND s.slot_date = $2 AND s.status IN ('booked', 'in_progress')
      ORDER BY s.slot_start_time;
    `;
    const result = await pool.query(query, [electrician_id, date]);
    return result.rows;
  }

  static async checkElectricianHasMultipleHostels(electrician_id, date, hostel_id) {
    const query = `
      SELECT DISTINCT h.id, h.name
      FROM slots s
      JOIN hostels h ON s.hostel_id = h.id
      WHERE s.electrician_id = $1 AND s.slot_date = $2 AND s.status IN ('booked', 'in_progress')
      AND h.id != $3;
    `;
    const result = await pool.query(query, [electrician_id, date, hostel_id]);
    return result.rows.length > 0;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE slots 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async assignElectrician(id, electrician_id) {
    const query = `
      UPDATE slots 
      SET electrician_id = $1, status = 'booked', updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [electrician_id, id]);
    return result.rows[0];
  }
}

module.exports = Slot;