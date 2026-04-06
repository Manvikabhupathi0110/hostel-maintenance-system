import React, { useState, useEffect } from 'react';
import { slotAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function MySlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await slotAPI.getMySlots();
        setSlots(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Booked Slots</h1>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No booked slots yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create a complaint to book a repair slot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}

