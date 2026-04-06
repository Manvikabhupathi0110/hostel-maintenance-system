const pool = require('../config/database');

class Electrician {
  static async create(electricianData) {
    const {
      user_id, experience_years, specialization, bio
    } = electricianData;

    const query = `
      INSERT INTO electricians 
      (user_id, experience_years, specialization, bio, availability_status)
      VALUES ($1, $2, $3, $4, 'available')
      RETURNING *;
    `;

    const result = await pool.query(query, [user_id, experience_years, specialization, bio]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT e.*, u.name, u.email, u.phone, u.status
      FROM electricians e
      JOIN users u ON e.user_id = u.id
      WHERE e.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = 'SELECT * FROM electricians WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT e.*, u.name, u.email, u.phone
      FROM electricians e
      JOIN users u ON e.user_id = u.id
      WHERE u.status = 'active'
    `;

    const params = [];
    let paramCount = 1;

    if (filters.availability_status) {
      query += ` AND e.availability_status = $${paramCount}`;
      params.push(filters.availability_status);
      paramCount++;
    }

    query += ' ORDER BY e.average_rating DESC LIMIT $' + paramCount + ' OFFSET $' + (paramCount + 1);
    params.push(filters.limit || 10);
    params.push(filters.offset || 0);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateAvailabilityStatus(id, status) {
    const query = `
      UPDATE electricians 
      SET availability_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async updateRating(id) {
    const query = `
      UPDATE electricians 
      SET average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE electrician_id = $1
      ),
      total_jobs = (
        SELECT COUNT(*) FROM work_records WHERE electrician_id = $1
      ),
      completed_jobs = (
        SELECT COUNT(*) FROM work_records WHERE electrician_id = $1 AND work_status = 'completed'
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Electrician;