const pool = require('../config/database');

class Complaint {
  static async create(complaintData) {
    const {
      room_id, student_id, hostel_id, issue_description, category, issue_photo_url, priority
    } = complaintData;

    const query = `
      INSERT INTO complaints 
      (room_id, student_id, hostel_id, issue_description, category, issue_photo_url, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *;
    `;

    const result = await pool.query(query, [
      room_id, student_id, hostel_id, issue_description, category, issue_photo_url, priority
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT c.*, r.room_number, h.name as hostel_name, u.name as student_name
      FROM complaints c
      LEFT JOIN rooms r ON c.room_id = r.id
      JOIN hostels h ON c.hostel_id = h.id
      JOIN users u ON c.student_id = u.id
      WHERE c.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByHostel(hostel_id, filters = {}) {
    let query = `
      SELECT c.*, r.room_number, h.name as hostel_name, u.name as student_name
      FROM complaints c
      LEFT JOIN rooms r ON c.room_id = r.id
      JOIN hostels h ON c.hostel_id = h.id
      JOIN users u ON c.student_id = u.id
      WHERE c.hostel_id = $1
    `;

    const params = [hostel_id];
    let paramCount = 2;

    if (filters.status) {
      query += ` AND c.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY c.created_at DESC LIMIT $' + paramCount + ' OFFSET $' + (paramCount + 1);
    params.push(filters.limit || 10);
    params.push(filters.offset || 0);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findByStudent(student_id) {
    const query = `
      SELECT c.*, r.room_number, h.name as hostel_name
      FROM complaints c
      LEFT JOIN rooms r ON c.room_id = r.id
      JOIN hostels h ON c.hostel_id = h.id
      WHERE c.student_id = $1
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE complaints 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async countByStatus(hostel_id, status) {
    const query = 'SELECT COUNT(*) FROM complaints WHERE hostel_id = $1 AND status = $2';
    const result = await pool.query(query, [hostel_id, status]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Complaint;