/**
 * Input validation utilities
 */

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const isValidRole = (role) => {
  const validRoles = ['student', 'electrician', 'warden', 'admin'];
  return validRoles.includes(role);
};

const isValidStatus = (status, type = 'complaint') => {
  const statusMap = {
    complaint: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    slot: ['available', 'booked', 'in_progress', 'completed', 'cancelled'],
    electrician: ['available', 'busy', 'on_leave']
  };
  return statusMap[type]?.includes(status) || false;
};

const isValidCategory = (category) => {
  const validCategories = ['lighting', 'fan', 'switch', 'wiring', 'appliance', 'general'];
  return validCategories.includes(category);
};

const isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  return validPriorities.includes(priority);
};

const isValidRating = (rating) => {
  const num = parseInt(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  // Encode HTML special characters to prevent XSS
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidRole,
  isValidStatus,
  isValidCategory,
  isValidPriority,
  isValidRating,
  sanitizeString
};
