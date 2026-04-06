/**
 * Application-wide constants
 */

const ROLES = {
  STUDENT: 'student',
  ELECTRICIAN: 'electrician',
  WARDEN: 'warden',
  ADMIN: 'admin'
};

const COMPLAINT_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const ELECTRICIAN_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_LEAVE: 'on_leave'
};

const COMPLAINT_CATEGORIES = ['lighting', 'fan', 'switch', 'wiring', 'appliance', 'general'];

const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'];

const HOSTEL_TYPES = ['boys', 'girls'];

const WORK_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ISSUES: 'issues'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Time slot constraints
const SLOT_CONFIG = {
  WEEKDAY_START: '16:00', // 4 PM
  WEEKDAY_END: '18:00',   // 6 PM
  SATURDAY_START: '09:00', // 9 AM
  SATURDAY_END: '17:00',   // 5 PM
  SLOT_DURATION_MINUTES: 60,
  DEFAULT_DAYS_AHEAD: 7
};

const MAX_UPLOAD_SIZE_MB = 5;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

module.exports = {
  ROLES,
  COMPLAINT_STATUS,
  SLOT_STATUS,
  ELECTRICIAN_STATUS,
  COMPLAINT_CATEGORIES,
  PRIORITY_LEVELS,
  HOSTEL_TYPES,
  WORK_STATUS,
  USER_STATUS,
  SLOT_CONFIG,
  MAX_UPLOAD_SIZE_MB,
  SUPPORTED_IMAGE_TYPES
};
