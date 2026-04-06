const pool = require('../config/database');

class Room {
  static async create(roomData) {
    const { hostel_id, room_number, floor, capacity } = roomData;

    const query = `
      INSERT INTO rooms (hostel_id, room_number, floor, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [hostel_id, room_number, floor, capacity || 2]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT r.*, h.name as hostel_name
      FROM rooms r
      JOIN hostels h ON r.hostel_id = h.id
      WHERE r.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByHostel(hostel_id) {
    const query = `
      SELECT * FROM rooms
      WHERE hostel_id = $1
      ORDER BY floor, room_number;
    `;
    const result = await pool.query(query, [hostel_id]);
    return result.rows;
  }

  static async findByNumber(hostel_id, room_number) {
    const query = 'SELECT * FROM rooms WHERE hostel_id = $1 AND room_number = $2';
    const result = await pool.query(query, [hostel_id, room_number]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const allowedFields = ['floor', 'capacity', 'occupants'];
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
      UPDATE rooms 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Room;
