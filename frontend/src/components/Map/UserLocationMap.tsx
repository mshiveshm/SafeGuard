import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAlerts } from '../../contexts/AlertContext';
import { MapPin, Shield, AlertTriangle, Users, Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface UserLocationMapProps {
  height?: string;
  showControls?: boolean;
}

export const UserLocationMap: React.FC<UserLocationMapProps> = ({ 
  height = '400px', 
  showControls = true 
}) => {
  const { activeAlerts } = useAlerts();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to access your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings to see your position on the map.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          setLocationError(errorMessage);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Mock safe zones and shelters
  const safeZones = [
    { id: 1, lat: 40.7589, lng: -73.9851, name: 'Community Center', type: 'shelter', capacity: 200 },
    { id: 2, lat: 40.6892, lng: -74.0445, name: 'Emergency Hospital', type: 'medical', capacity: 50 },
    { id: 3, lat: 40.7414, lng: -74.0055, name: 'Supply Distribution Center', type: 'supplies', capacity: 500 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getSafeZoneIcon = (type: string) => {
    const color = type === 'medical' ? '#ef4444' : type === 'shelter' ? '#22c55e' : '#3b82f6';
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9L13 9V7L11 7V9L9 9V7L7 7V9L5 9C3.9 9 3 9.9 3 11V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V11C21 9.9 20.1 9 19 9H21Z"/>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const userIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {showControls && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Live Disaster Map</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Disaster Zones</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Safe Zones</span>
              </div>
            </div>
          </div>
          {locationError && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{locationError}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User Location */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-blue-800">Your Location</h3>
                  <p className="text-sm text-gray-600">Current position</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Disaster Alerts */}
          {activeAlerts.map((alert) => (
            <React.Fragment key={alert.id}>
              <Circle
                center={[alert.location.lat, alert.location.lng]}
                radius={alert.affectedRadius * 1000}
                fillColor={getSeverityColor(alert.severity)}
                fillOpacity={0.1}
                color={getSeverityColor(alert.severity)}
                weight={2}
              />
              <Marker position={[alert.location.lat, alert.location.lng]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-red-800">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-500">
                      <div>Location: {alert.location.address}</div>
                      <div>Severity: <span className="font-medium">{alert.severity.toUpperCase()}</span></div>
                      <div>Radius: {alert.affectedRadius}km</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Safe Zones */}
          {safeZones.map((zone) => (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={getSafeZoneIcon(zone.type)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-green-800">{zone.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 capitalize">{zone.type} Facility</p>
                  <div className="text-xs">
                    <div>Capacity: {zone.capacity} people</div>
                    <div className="text-green-600 font-medium">Available</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};