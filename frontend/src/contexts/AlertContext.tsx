import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Alert {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'evacuation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  isActive: boolean;
  affectedRadius: number; // in kilometers
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
  activeAlerts: Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Mock real-time alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'earthquake',
        severity: 'high',
        title: '6.2 Earthquake Detected',
        message: 'A magnitude 6.2 earthquake has been detected 15km northeast of downtown. Seek shelter immediately.',
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: 'Manhattan, NY'
        },
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isActive: true,
        affectedRadius: 25
      },
      {
        id: '2',
        type: 'flood',
        severity: 'medium',
        title: 'Flash Flood Warning',
        message: 'Heavy rainfall expected. Low-lying areas may experience flooding.',
        location: {
          lat: 40.6892,
          lng: -74.0445,
          address: 'Brooklyn, NY'
        },
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isActive: true,
        affectedRadius: 15
      }
    ];
    
    setAlerts(mockAlerts);
  }, []);

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);

  const value = {
    alerts,
    addAlert,
    dismissAlert,
    activeAlerts
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};