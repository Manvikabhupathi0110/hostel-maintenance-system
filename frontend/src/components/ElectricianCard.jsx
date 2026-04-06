import React from 'react';
import { Star, Briefcase, CheckCircle } from 'lucide-react';

export default function ElectricianCard({ electrician, onSelect, actionLabel }) {
  const rating = parseFloat(electrician.average_rating) || 0;

  return (
    <div
      onClick={() => onSelect && onSelect(electrician)}
      className={`bg-white rounded-lg border border-gray-200 p-4 ${onSelect ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{electrician.name}</h3>
          <p className="text-sm text-gray-500">{electrician.specialization || 'General'}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            electrician.availability_status === 'available'
              ? 'bg-green-100 text-green-800'
              : electrician.availability_status === 'busy'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {electrician.availability_status?.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={14} />
          <span>{electrician.experience_years || 0} yrs</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle size={14} className="text-green-500" />
          <span>{electrician.completed_jobs || 0} jobs</span>
        </div>
      </div>

      {actionLabel && (
        <button className="w-full bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
