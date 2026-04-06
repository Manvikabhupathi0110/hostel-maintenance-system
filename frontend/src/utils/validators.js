/**
 * Frontend form validators
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? null : 'Enter a valid email address';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  const re = /^[0-9]{10}$/;
  return re.test(phone) ? null : 'Enter a valid 10-digit phone number';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateRating = (rating) => {
  const num = parseInt(rating);
  if (isNaN(num) || num < 1 || num > 5) return 'Rating must be between 1 and 5';
  return null;
};

export const validateMinLength = (value, min, fieldName = 'Field') => {
  if (!value || value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};
