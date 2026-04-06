const pool = require('../config/database');

class AnalyticsController {
  static async getOverallStats(req, res) {
    try {
      const statsQuery = `
        SELECT
          (SELECT COUNT(*) FROM complaints) as total_complaints,
          (SELECT COUNT(*) FROM complaints WHERE status = 'pending') as pending_complaints,
          (SELECT COUNT(*) FROM complaints WHERE status = 'completed') as completed_complaints,
          (SELECT COUNT(*) FROM complaints WHERE status = 'in_progress') as in_progress_complaints,
          (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
          (SELECT COUNT(*) FROM electricians) as total_electricians,
          (SELECT COUNT(*) FROM hostels) as total_hostels,
          (SELECT COUNT(*) FROM slots WHERE status = 'booked') as booked_slots,
          (SELECT COALESCE(AVG(rating), 0) FROM ratings) as average_rating;
      `;

      const result = await pool.query(statsQuery);
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getComplaintsByCategory(req, res) {
    try {
      const query = `
        SELECT category, COUNT(*) as count
        FROM complaints
        GROUP BY category
        ORDER BY count DESC;
      `;
      const result = await pool.query(query);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getComplaintsByStatus(req, res) {
    try {
      const query = `
        SELECT status, COUNT(*) as count
        FROM complaints
        GROUP BY status
        ORDER BY count DESC;
      `;
      const result = await pool.query(query);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTopElectricians(req, res) {
    try {
      const query = `
        SELECT e.id, u.name, e.average_rating, e.completed_jobs, e.total_jobs
        FROM electricians e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.average_rating DESC, e.completed_jobs DESC
        LIMIT 10;
      `;
      const result = await pool.query(query);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getComplaintTrends(req, res) {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE status = 'completed') as completed
        FROM complaints
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month;
      `;
      const result = await pool.query(query);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getHostelStats(req, res) {
    try {
      const query = `
        SELECT 
          h.id, h.name, h.hostel_type,
          COUNT(DISTINCT c.id) as total_complaints,
          COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed') as completed_complaints,
          COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'pending') as pending_complaints
        FROM hostels h
        LEFT JOIN complaints c ON c.hostel_id = h.id
        GROUP BY h.id, h.name, h.hostel_type
        ORDER BY h.name;
      `;
      const result = await pool.query(query);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AnalyticsController;
