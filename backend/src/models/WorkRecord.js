const pool = require('../config/database');

class WorkRecord {
  static async create(workData) {
    const {
      slot_id, electrician_id, complaint_id, before_photo_url, after_photo_url, parts_used, labor_hours, notes
    } = workData;

    const query = `
      INSERT INTO work_records 
      (slot_id, electrician_id, complaint_id, before_photo_url, after_photo_url, parts_used, labor_hours, notes, work_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed')
      RETURNING *;
    `;

    const result = await pool.query(query, [
      slot_id, electrician_id, complaint_id, before_photo_url, after_photo_url, parts_used, labor_hours, notes
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT w.*, s.slot_date, s.slot_start_time, c.issue_description, e.user_id as electrician_user_id
      FROM work_records w
      JOIN slots s ON w.slot_id = s.id
      JOIN complaints c ON w.complaint_id = c.id
      JOIN electricians e ON w.electrician_id = e.id
      WHERE w.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByComplaint(complaint_id) {
    const query = `
      SELECT w.* FROM work_records w
      WHERE w.complaint_id = $1
      ORDER BY w.created_at DESC;
    `;
    const result = await pool.query(query, [complaint_id]);
    return result.rows[0];
  }

  static async findByElectrician(electrician_id) {
    const query = `
      SELECT w.*, c.issue_description, s.slot_date, u.name as student_name
      FROM work_records w
      JOIN complaints c ON w.complaint_id = c.id
      JOIN slots s ON w.slot_id = s.id
      JOIN users u ON c.student_id = u.id
      WHERE w.electrician_id = $1
      ORDER BY w.created_at DESC
      LIMIT 50;
    `;
    const result = await pool.query(query, [electrician_id]);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['work_status', 'parts_used', 'labor_hours', 'notes'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE work_records 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = WorkRecord;