import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: (token) => api.post('/auth/refresh', { token }),
};

// Complaint endpoints
export const complaintAPI = {
  create: (data, file) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    if (file) {
      formData.append('issue_photo', file);
    }
    return api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getById: (id) => api.get(`/complaints/${id}`),
  getStudentComplaints: () => api.get('/complaints/student/my-complaints'),
  getHostelComplaints: (hostelId, filters) =>
    api.get(`/complaints/hostel/${hostelId}`, { params: filters }),
  updateStatus: (id, status) => api.patch(`/complaints/${id}/status`, { status }),
};

// Slot endpoints
export const slotAPI = {
  getAvailable: (hostelId, date) =>
    api.get('/slots/available', { params: { hostel_id: hostelId, date } }),
  book: (slotId, electricianId) =>
    api.post('/slots/book', { slot_id: slotId, electrician_id: electricianId }),
  autoAssign: (slotId) => api.post('/slots/auto-assign', { slot_id: slotId }),
  getById: (id) => api.get(`/slots/${id}`),
  getAvailableElectricians: (slotId) => api.get(`/slots/${slotId}/electricians`),
  updateStatus: (id, status) => api.patch(`/slots/${id}/status`, { status }),
  getMySlots: () => api.get('/slots/my-slots'),
};

// Electrician endpoints
export const electricianAPI = {
  getAll: (params) => api.get('/electricians', { params }),
  getById: (id) => api.get(`/electricians/${id}`),
  getMyProfile: () => api.get('/electricians/me'),
  getMyStats: () => api.get('/electricians/me/stats'),
  updateAvailability: (id, availability_status) =>
    api.patch(`/electricians/${id}/availability`, { availability_status }),
  updateMyProfile: (data) => api.put('/electricians/me/profile', data),
};

// Work record endpoints
export const workRecordAPI = {
  create: (formData) =>
    api.post('/work-records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (id) => api.get(`/work-records/${id}`),
  getByComplaint: (complaintId) => api.get(`/work-records/complaint/${complaintId}`),
  getMyRecords: () => api.get('/work-records/me'),
  update: (id, data) => api.patch(`/work-records/${id}`, data),
};

// Rating endpoints
export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getById: (id) => api.get(`/ratings/${id}`),
  getElectricianRatings: (electricianId) => api.get(`/ratings/electrician/${electricianId}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getOverallStats: () => api.get('/analytics/stats'),
  getComplaintsByCategory: () => api.get('/analytics/complaints/by-category'),
  getComplaintsByStatus: () => api.get('/analytics/complaints/by-status'),
  getComplaintTrends: () => api.get('/analytics/complaints/trends'),
  getTopElectricians: () => api.get('/analytics/electricians/top'),
  getHostelStats: () => api.get('/analytics/hostels'),
};

export default api;