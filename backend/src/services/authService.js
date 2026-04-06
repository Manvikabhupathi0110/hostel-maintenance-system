const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Electrician = require('../models/Electrician');
const jwtConfig = require('../config/jwt');

class AuthService {
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create user
      const user = await User.create(userData);

      // If registering as electrician, create electrician profile
      if (userData.role === 'electrician') {
        const electricianData = {
          user_id: user.id,
          experience_years: userData.experience_years || 0,
          specialization: userData.specialization || '',
          bio: userData.bio || ''
        };
        await Electrician.create(electricianData);
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const passwordValid = await User.verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        throw new Error('Invalid email or password');
      }

      // Check user status
      if (user.status !== 'active') {
        throw new Error('User account is not active');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  static refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const newToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );
      return newToken;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}

module.exports = AuthService;