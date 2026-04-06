import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slotAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SlotCard from '../components/SlotCard';
import ElectricianCard from '../components/ElectricianCard';
import Modal from '../components/Modal';
import { Zap, Star, Calendar } from 'lucide-react';

export default function ElectricianDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      // Get today's slots for this electrician via available slots
      setLoading(false);
    } catch (err) {
      setError('Failed to load assignments');
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Your electrician dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/assignments')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Today's Assignments</p>
              <p className="text-2xl font-bold">View</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/electrician-profile')}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <Zap size={32} className="text-green-500" />
            <div>
              <p className="text-gray-600 text-sm">My Profile</p>
              <p className="text-2xl font-bold">Update</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <Star size={32} className="text-yellow-500" />
            <div>
              <p className="text-gray-600 text-sm">Performance</p>
              <p className="text-2xl font-bold">Track</p>
            </div>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/assignments')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
          >
            <Calendar size={24} className="text-blue-600" />
            <div>
              <p className="font-medium">View Assignments</p>
              <p className="text-sm text-gray-500">See your scheduled repairs</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/electrician-profile')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
          >
            <Zap size={24} className="text-green-600" />
            <div>
              <p className="font-medium">Update Profile</p>
              <p className="text-sm text-gray-500">Manage your availability</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}