import React from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Alert } from '../../contexts/AlertContext';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className={`border-l-4 p-6 rounded-lg shadow-md ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getAlertIcon(alert.type)}
            <h3 className="text-lg font-semibold">{alert.title}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
              {alert.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-sm opacity-90 mb-3">{alert.message}</p>
          <div className="flex items-center space-x-4 text-xs opacity-75">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{alert.location.address}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};