import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  booked: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function SlotCard({ slot, onSelect, actionLabel }) {
  return (
    <div
      onClick={() => onSelect && onSelect(slot)}
      className={`bg-white rounded-lg border border-gray-200 p-4 ${onSelect ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <Calendar size={16} />
          {format(new Date(slot.slot_date), 'EEE, MMM dd yyyy')}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[slot.status]}`}>
          {slot.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
        <Clock size={14} />
        {slot.slot_start_time?.slice(0, 5)} - {slot.slot_end_time?.slice(0, 5)}
      </div>

      {slot.electrician_name && (
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <User size={14} />
          {slot.electrician_name}
        </div>
      )}

      {actionLabel && (
        <button className="mt-3 w-full bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
