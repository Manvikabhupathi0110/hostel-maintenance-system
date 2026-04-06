import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slotAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function SlotBooking() {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await slotAPI.getAvailable(null, null);
        const all = response.data?.data || [];
        // Filter slots for this complaint if complaint_id is provided
        const filtered = complaint_id
          ? all.filter((s) => String(s.complaint_id) === String(complaint_id))
          : all;
        setSlots(filtered);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load available slots');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [complaint_id]);

  const handleAutoAssign = async (slotId) => {
    setBooking(true);
    setError('');
    try {
      await slotAPI.autoAssign(slotId);
      setSuccess('Electrician successfully assigned to slot!');
      // Refresh slots
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, status: 'booked' } : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign electrician');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Book a Repair Slot</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {loading ? (
        <LoadingSpinner />
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No available slots at the moment.</p>
          <p className="text-sm text-gray-400 mt-1">
            Please check back later or contact the warden.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-lg shadow p-4">
              <SlotCard slot={slot} />
              {slot.status === 'available' && (
                <button
                  onClick={() => handleAutoAssign(slot.id)}
                  disabled={booking}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {booking ? 'Assigning…' : 'Auto-Assign Best Electrician'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
