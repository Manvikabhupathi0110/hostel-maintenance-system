import { create } from 'zustand';
import { complaintAPI } from '../services/api';

const useComplaintStore = create((set) => ({
  complaints: [],
  currentComplaint: null,
  loading: false,
  error: null,

  fetchStudentComplaints: async () => {
    set({ loading: true, error: null });
    try {
      const response = await complaintAPI.getStudentComplaints();
      set({ complaints: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchComplaint: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await complaintAPI.getById(id);
      set({ currentComplaint: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setComplaints: (complaints) => set({ complaints }),
  setCurrentComplaint: (complaint) => set({ currentComplaint: complaint }),
  clearComplaints: () => set({ complaints: [], currentComplaint: null })
}));

export default useComplaintStore;
