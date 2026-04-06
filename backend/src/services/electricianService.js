const Electrician = require('../models/Electrician');
const pool = require('../config/database');

class ElectricianService {
  static async getAll(filters = {}) {
    return Electrician.getAll(filters);
  }

  static async getById(id) {
    const electrician = await Electrician.findById(id);
    if (!electrician) {
      throw new Error('Electrician not found');
    }
    return electrician;
  }

  static async getByUserId(user_id) {
    return Electrician.findByUserId(user_id);
  }

  static async updateAvailability(id, status) {
    const validStatuses = ['available', 'busy', 'on_leave'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid availability status');
    }
    return Electrician.updateAvailabilityStatus(id, status);
  }

  static async updateProfile(user_id, updates) {
    const electrician = await Electrician.findByUserId(user_id);
    if (!electrician) {
      throw new Error('Electrician profile not found');
    }

    const allowedFields = ['experience_years', 'specialization', 'bio', 'certificates'];
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

    if (fields.length === 0) return electrician;

    values.push(electrician.id);
    const query = `
      UPDATE electricians 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getElectricianStats(electrician_id) {
    const query = `
      SELECT 
        e.total_jobs,
        e.completed_jobs,
        e.average_rating,
        e.total_earnings,
        COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'booked') as upcoming_slots,
        COUNT(DISTINCT r.id) as total_ratings
      FROM electricians e
      LEFT JOIN slots s ON s.electrician_id = e.id
      LEFT JOIN ratings r ON r.electrician_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, e.total_jobs, e.completed_jobs, e.average_rating, e.total_earnings;
    `;
    const result = await pool.query(query, [electrician_id]);
    return result.rows[0];
  }

  static async refreshRating(electrician_id) {
    return Electrician.updateRating(electrician_id);
  }
}

module.exports = ElectricianService;
