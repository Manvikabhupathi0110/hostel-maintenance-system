import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workRecordAPI } from '../services/api';
import Alert from '../components/Alert';
import { Upload } from 'lucide-react';

export default function UploadWorkRecord() {
  const { slot_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    complaint_id: '',
    parts_used: '',
    labor_hours: '',
    notes: ''
  });
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('slot_id', slot_id);
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (beforePhoto) data.append('before_photo', beforePhoto);
      if (afterPhoto) data.append('after_photo', afterPhoto);

      await workRecordAPI.create(data);
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload work record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Work Record</h1>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Complaint ID *</label>
            <input
              type="number"
              name="complaint_id"
              value={formData.complaint_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Before Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <Upload size={24} className="text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">
                  {beforePhoto ? beforePhoto.name : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setBeforePhoto(e.target.files[0])}
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">After Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <Upload size={24} className="text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">
                  {afterPhoto ? afterPhoto.name : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAfterPhoto(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Parts Used</label>
            <input
              type="text"
              name="parts_used"
              value={formData.parts_used}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Fuse, Wire 2m"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Labor Hours</label>
            <input
              type="number"
              name="labor_hours"
              value={formData.labor_hours}
              onChange={handleChange}
              step="0.5"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Submit Work Record'}
          </button>
        </form>
      </div>
    </div>
  );
}
