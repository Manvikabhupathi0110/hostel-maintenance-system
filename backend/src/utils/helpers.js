/**
 * Utility helper functions
 */

/**
 * Format a date to YYYY-MM-DD string
 */
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format time from "HH:MM:SS" to "HH:MM AM/PM"
 */
const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;
  return { limit: limitNum, offset, page: pageNum };
};

/**
 * Build a success response object
 */
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

/**
 * Build an error response object
 */
const errorResponse = (message = 'Error', errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return response;
};

/**
 * Generate a random OTP (for future use)
 */
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * Remove sensitive fields from user object
 */
const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

module.exports = {
  formatDate,
  formatTime,
  paginate,
  successResponse,
  errorResponse,
  generateOTP,
  sanitizeUser
};
