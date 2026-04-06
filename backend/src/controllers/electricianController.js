const ElectricianService = require('../services/electricianService');

class ElectricianController {
  static async getAllElectricians(req, res) {
    try {
      const { availability_status, limit, offset } = req.query;
      const filters = {
        availability_status,
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0
      };

      const electricians = await ElectricianService.getAll(filters);

      res.status(200).json({
        success: true,
        data: electricians
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getElectrician(req, res) {
    try {
      const { id } = req.params;
      const electrician = await ElectricianService.getById(id);

      res.status(200).json({
        success: true,
        data: electrician
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getMyProfile(req, res) {
    try {
      const electrician = await ElectricianService.getByUserId(req.user.id);

      if (!electrician) {
        return res.status(404).json({
          success: false,
          message: 'Electrician profile not found'
        });
      }

      res.status(200).json({
        success: true,
        data: electrician
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability_status } = req.body;

      const electrician = await ElectricianService.updateAvailability(id, availability_status);

      res.status(200).json({
        success: true,
        message: 'Availability updated',
        data: electrician
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const electrician = await ElectricianService.updateProfile(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated',
        data: electrician
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getStats(req, res) {
    try {
      const electrician = await ElectricianService.getByUserId(req.user.id);
      if (!electrician) {
        return res.status(404).json({ success: false, message: 'Electrician profile not found' });
      }

      const stats = await ElectricianService.getElectricianStats(electrician.id);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ElectricianController;
