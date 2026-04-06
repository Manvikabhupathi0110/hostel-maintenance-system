import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI, slotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SlotCard from '../components/SlotCard';
import { ArrowLeft, Clock, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const response = await complaintAPI.getById(id);
      setComplaint(response.data.data);

      if (response.data.data.hostel_id) {
        const slotsRes = await slotAPI.getAvailable(response.data.data.hostel_id);
        setSlots(slotsRes.data.data || []);
      }
    } catch (err) {
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!complaint) return <Alert type="warning" message="Complaint not found" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">Complaint #{complaint.id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[complaint.status]}`}>
            {complaint.status?.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Hostel:</span> {complaint.hostel_name}
          </div>
          <div>
            <span className="font-medium">Room:</span> {complaint.room_number}
          </div>
          <div className="flex items-center gap-1">
            <Tag size={14} />
            <span className="font-medium">Category:</span> {complaint.category}
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={14} />
            <span className="font-medium">Priority:</span> {complaint.priority}
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <Clock size={14} />
            <span className="font-medium">Submitted:</span>{' '}
            {format(new Date(complaint.created_at), 'MMM dd, yyyy HH:mm')}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-1">Issue Description:</p>
          <p className="text-gray-600">{complaint.issue_description}</p>
        </div>

        {complaint.issue_photo_url && (
          <div className="mt-4">
            <p className="font-medium text-gray-700 mb-2">Issue Photo:</p>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${complaint.issue_photo_url}`}
              alt="Issue"
              className="max-w-full rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {slots.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Available Repair Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {slots.slice(0, 6).map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}