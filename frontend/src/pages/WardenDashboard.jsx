import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { FileText, Users, CheckCircle, Clock, Home } from 'lucide-react';

export default function WardenDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getOverallStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Warden Dashboard</h1>

      {error && <Alert type="error" message={error} />}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-blue-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Complaints</p>
                <p className="text-2xl font-bold">{stats.total_complaints}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-yellow-500" />
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pending_complaints}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-500" />
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold">{stats.completed_complaints}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-purple-500" />
              <div>
                <p className="text-gray-500 text-sm">Electricians</p>
                <p className="text-2xl font-bold">{stats.total_electricians}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/warden/complaints')}
          className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow border border-gray-100"
        >
          <FileText size={32} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-lg">All Complaints</h3>
          <p className="text-gray-500 text-sm">View and manage all complaints</p>
        </button>
        <button
          onClick={() => navigate('/warden/electricians')}
          className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow border border-gray-100"
        >
          <Users size={32} className="text-green-500 mb-3" />
          <h3 className="font-bold text-lg">Electricians</h3>
          <p className="text-gray-500 text-sm">Manage electrician team</p>
        </button>
        <button
          onClick={() => navigate('/admin/analytics')}
          className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow border border-gray-100"
        >
          <Home size={32} className="text-purple-500 mb-3" />
          <h3 className="font-bold text-lg">Analytics</h3>
          <p className="text-gray-500 text-sm">View reports and trends</p>
        </button>
      </div>
    </div>
  );
}
