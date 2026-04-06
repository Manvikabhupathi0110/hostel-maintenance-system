import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div
        className={`${sizeMap[size]} border-4 border-blue-200 border-t-blue-600 rounded-full spinner`}
      />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}
