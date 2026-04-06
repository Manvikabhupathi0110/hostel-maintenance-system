import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SlotCard from '../components/SlotCard';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export default function Assignments() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch electrician's assigned slots
    setLoading(false);
  }, []);

  const stats = {
    total: slots.length,
    booked: slots.filter((s) => s.status === 'booked').length,
    completed: slots.filter((s) => s.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Assignments</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Upcoming</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.booked}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No assignments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <div key={slot.id} className="relative">
              <SlotCard slot={slot} />
              {slot.status === 'booked' && (
                <button
                  onClick={() => navigate(`/upload-work-record/${slot.id}`)}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Mark Complete & Upload Work
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
