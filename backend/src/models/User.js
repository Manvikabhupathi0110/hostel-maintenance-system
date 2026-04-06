const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, phone, password, role } = userData;
    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, phone, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, name, email, phone, role, status, created_at;
    `;

    const result = await pool.query(query, [name, email, phone, passwordHash, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  static async updateProfile(id, updates) {
    const allowedFields = ['name', 'phone'];
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
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, role, status;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;