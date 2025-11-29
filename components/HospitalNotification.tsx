import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, MapPin, Clock, X } from 'lucide-react';

interface HospitalNotificationProps {
  isVisible: boolean;
  message: string;
  location: string;
  status: string;
  timeframe: string;
  onDismiss: () => void;
  timestamp: string;
}

export const HospitalNotification: React.FC<HospitalNotificationProps> = ({
  isVisible,
  message,
  location,
  status,
  timeframe,
  onDismiss,
  timestamp
}) => {
  const [autoClose, setAutoClose] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAutoClose(false);
      // Auto-close after 8 seconds
      const timer = setTimeout(() => {
        setAutoClose(true);
        setTimeout(() => onDismiss(), 500);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`
        bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-500 rounded-2xl shadow-2xl max-w-md w-full p-6
        transform transition-all duration-300
        ${autoClose ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-red-200 uppercase tracking-wide">ServiceNow Alert</h2>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Message */}
        <div className="bg-black/30 p-4 rounded-lg mb-4 border border-red-700/50">
          <p className="text-white font-mono text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-6">
          {/* Status */}
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Stampede Status</div>
              <div className="text-sm font-mono text-red-200">{status}</div>
            </div>
          </div>

          {/* Timeframe */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Event Timeframe</div>
              <div className="text-sm font-mono text-red-200">{timeframe}</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Alert Location</div>
              <div className="text-sm font-mono text-red-200">{location}</div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Time Sent</div>
              <div className="text-sm font-mono text-red-200">{timestamp}</div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700/50 rounded-lg mb-4">
          <span className="text-xs font-bold text-green-300 uppercase tracking-wider">ServiceNow Status</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300 font-mono">Posted</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-200 py-2 rounded-lg font-semibold transition-colors border border-red-700/50"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
