import { create } from 'zustand';
import { slotAPI } from '../services/api';

const useSlotStore = create((set) => ({
  slots: [],
  currentSlot: null,
  availableElectricians: [],
  loading: false,
  error: null,

  fetchAvailableSlots: async (hostelId, date) => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getAvailable(hostelId, date);
      set({ slots: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSlot: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getById(id);
      set({ currentSlot: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAvailableElectricians: async (slotId) => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getAvailableElectricians(slotId);
      set({ availableElectricians: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSlots: (slots) => set({ slots }),
  clearSlots: () => set({ slots: [], currentSlot: null })
}));

export default useSlotStore;
