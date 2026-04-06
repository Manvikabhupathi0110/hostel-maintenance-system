import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import ComplaintCard from '../components/ComplaintCard';
import { Plus, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getStudentComplaints();
      setComplaints(response.data.data);
    } catch (err) {
      setError('Failed to load complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    completed: complaints.filter((c) => c.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage your maintenance requests</p>
        </div>
        <button
          onClick={() => navigate('/new-complaint')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> New Complaint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Complaints</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Your Complaints</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No complaints yet. Click "New Complaint" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onSelect={(c) => navigate(`/complaint/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}