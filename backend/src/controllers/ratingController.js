const Rating = require('../models/Rating');
const ElectricianService = require('../services/electricianService');
const WorkRecord = require('../models/WorkRecord');

class RatingController {
  static async createRating(req, res) {
    try {
      const { work_record_id, electrician_id, rating, review } = req.body;
      const student_id = req.user.id;

      // Validate rating range
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Check if already rated
      const existingRating = await Rating.findByWorkRecord(work_record_id);
      if (existingRating) {
        return res.status(400).json({
          success: false,
          message: 'Work record already rated'
        });
      }

      const ratingRecord = await Rating.create({
        work_record_id,
        student_id,
        electrician_id,
        rating,
        review
      });

      // Update electrician's average rating
      await ElectricianService.refreshRating(electrician_id);

      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: ratingRecord
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getElectricianRatings(req, res) {
    try {
      const { electrician_id } = req.params;
      const ratings = await Rating.findByElectrician(electrician_id);

      res.status(200).json({
        success: true,
        data: ratings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRating(req, res) {
    try {
      const { id } = req.params;
      const rating = await Rating.findById(id);

      if (!rating) {
        return res.status(404).json({
          success: false,
          message: 'Rating not found'
        });
      }

      res.status(200).json({
        success: true,
        data: rating
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = RatingController;
