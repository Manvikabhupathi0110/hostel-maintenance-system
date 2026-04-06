import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const priorityColors = {
  low: 'bg-gray-200',
  medium: 'bg-yellow-200',
  high: 'bg-orange-200',
  urgent: 'bg-red-200',
};

export default function ComplaintCard({ complaint, onSelect }) {
  return (
    <div
      onClick={() => onSelect(complaint)}
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{complaint.issue_description.length > 50 ? complaint.issue_description.substring(0, 50) + '...' : complaint.issue_description}</h3>
          <p className="text-sm text-gray-600">Room {complaint.room_number}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <span className={`px-2 py-1 rounded ${priorityColors[complaint.priority]}`}>
            {complaint.priority}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock size={16} />
          {format(new Date(complaint.created_at), 'MMM dd, yyyy')}
        </span>
      </div>
    </div>
  );
}