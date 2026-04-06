const pool = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { work_record_id, student_id, electrician_id, rating, review } = ratingData;

    const query = `
      INSERT INTO ratings (work_record_id, student_id, electrician_id, rating, review)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      work_record_id, student_id, electrician_id, rating, review
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT r.*, u.name as student_name, e_user.name as electrician_name
      FROM ratings r
      JOIN users u ON r.student_id = u.id
      JOIN electricians e ON r.electrician_id = e.id
      JOIN users e_user ON e.user_id = e_user.id
      WHERE r.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByElectrician(electrician_id) {
    const query = `
      SELECT r.*, u.name as student_name
      FROM ratings r
      JOIN users u ON r.student_id = u.id
      WHERE r.electrician_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(query, [electrician_id]);
    return result.rows;
  }

  static async findByWorkRecord(work_record_id) {
    const query = 'SELECT * FROM ratings WHERE work_record_id = $1';
    const result = await pool.query(query, [work_record_id]);
    return result.rows[0];
  }

  static async getAverageRating(electrician_id) {
    const query = `
      SELECT COALESCE(AVG(rating), 0) as average, COUNT(*) as count
      FROM ratings WHERE electrician_id = $1;
    `;
    const result = await pool.query(query, [electrician_id]);
    return result.rows[0];
  }
}

module.exports = Rating;
