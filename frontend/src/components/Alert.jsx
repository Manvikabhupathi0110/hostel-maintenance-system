import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const alertConfig = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-800'
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 border-red-200 text-red-800'
  },
  warning: {
    icon: AlertCircle,
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800'
  }
};

export default function Alert({ type = 'info', message, onClose }) {
  const { icon: Icon, classes } = alertConfig[type] || alertConfig.info;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${classes}`}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
