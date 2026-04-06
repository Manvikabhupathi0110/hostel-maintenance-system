import React, { useState, useEffect } from 'react';
import { electricianAPI } from '../services/api';
import ElectricianCard from '../components/ElectricianCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function ElectriciansList() {
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    fetchElectricians();
  }, [availabilityFilter]);

  const fetchElectricians = async () => {
    setLoading(true);
    try {
      const params = {};
      if (availabilityFilter) params.availability_status = availabilityFilter;
      const response = await electricianAPI.getAll(params);
      setElectricians(response.data.data);
    } catch (err) {
      setError('Failed to load electricians');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Electricians</h1>

      <div className="flex gap-2">
        {['', 'available', 'busy', 'on_leave'].map((status) => (
          <button
            key={status}
            onClick={() => setAvailabilityFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              availabilityFilter === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {status === '' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : electricians.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No electricians found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electricians.map((electrician) => (
            <ElectricianCard key={electrician.id} electrician={electrician} />
          ))}
        </div>
      )}
    </div>
  );
}
