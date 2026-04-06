import React, { useState, useEffect } from 'react';
import { electricianAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { User, Zap, Star } from 'lucide-react';

export default function ElectricianProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    experience_years: '',
    specialization: '',
    bio: '',
    availability_status: 'available'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await electricianAPI.getMyProfile();
      setProfile(response.data.data);
      setFormData({
        experience_years: response.data.data.experience_years || '',
        specialization: response.data.data.specialization || '',
        bio: response.data.data.bio || '',
        availability_status: response.data.data.availability_status || 'available'
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await electricianAPI.updateMyProfile(formData);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityChange = async (status) => {
    try {
      await electricianAPI.updateAvailability(profile.id, status);
      setFormData((prev) => ({ ...prev, availability_status: status }));
      setSuccess('Availability updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      {profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              {parseFloat(profile.average_rating || 0).toFixed(1)} rating
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap size={16} />
              {profile.completed_jobs || 0} jobs completed
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
            <div className="flex gap-2">
              {['available', 'busy', 'on_leave'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleAvailabilityChange(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    formData.availability_status === status
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Years of Experience</label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
