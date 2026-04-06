const pool = require('../config/database');

class Hostel {
  static async create(hostelData) {
    const { name, hostel_type, total_rooms, warden_id, location } = hostelData;

    const query = `
      INSERT INTO hostels (name, hostel_type, total_rooms, warden_id, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [name, hostel_type, total_rooms, warden_id, location]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT h.*, u.name as warden_name
      FROM hostels h
      LEFT JOIN users u ON h.warden_id = u.id
      WHERE h.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT h.*, u.name as warden_name
      FROM hostels h
      LEFT JOIN users u ON h.warden_id = u.id
    `;
    const params = [];
    let paramCount = 1;

    if (filters.hostel_type) {
      query += ` WHERE h.hostel_type = $${paramCount}`;
      params.push(filters.hostel_type);
      paramCount++;
    }

    query += ' ORDER BY h.name';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'total_rooms', 'warden_id', 'location'];
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
      UPDATE hostels 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Hostel;
