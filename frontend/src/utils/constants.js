export const ROLES = {
  STUDENT: 'student',
  ELECTRICIAN: 'electrician',
  WARDEN: 'warden',
  ADMIN: 'admin'
};

export const COMPLAINT_CATEGORIES = [
  { value: 'lighting', label: 'Lighting' },
  { value: 'fan', label: 'Fan' },
  { value: 'switch', label: 'Switch' },
  { value: 'wiring', label: 'Wiring' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'general', label: 'General' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

export const COMPLAINT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const HOSTELS = [
  { id: 1, name: 'Boys Hostel A', type: 'boys' },
  { id: 2, name: 'Boys Hostel B', type: 'boys' },
  { id: 3, name: 'Girls Hostel A', type: 'girls' },
  { id: 4, name: 'Girls Hostel B', type: 'girls' },
  { id: 5, name: 'Girls Hostel C', type: 'girls' }
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';