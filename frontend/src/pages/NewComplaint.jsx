import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { AlertCircle } from 'lucide-react';

export default function NewComplaint() {
  const [formData, setFormData] = useState({
    room_id: '',
    hostel_id: '',
    issue_description: '',
    category: 'general',
    priority: 'medium',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await complaintAPI.create(formData, file);
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Register New Complaint</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Hostel *</label>
              <select
                name="hostel_id"
                value={formData.hostel_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Hostel</option>
                <option value="1">Boys Hostel A</option>
                <option value="2">Boys Hostel B</option>
                <option value="3">Girls Hostel A</option>
                <option value="4">Girls Hostel B</option>
                <option value="5">Girls Hostel C</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Room Number *</label>
              <input
                type="number"
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Issue Description *</label>
            <textarea
              name="issue_description"
              value={formData.issue_description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="general">General</option>
                <option value="lighting">Lighting</option>
                <option value="fan">Fan</option>
                <option value="switch">Switch</option>
                <option value="wiring">Wiring</option>
                <option value="appliance">Appliance</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Issue Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}