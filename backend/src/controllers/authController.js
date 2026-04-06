const AuthService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { token } = req.body;
      const newToken = AuthService.refreshToken(token);

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: { token: newToken }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  static logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}

module.exports = AuthController;