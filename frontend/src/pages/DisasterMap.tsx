import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAlerts } from '../contexts/AlertContext';
import { AlertTriangle, MapPin, Users, Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const DisasterMap: React.FC = () => {
  const { activeAlerts } = useAlerts();

  // Mock data for volunteers and resources
  const volunteers = [
    { id: 1, lat: 40.7128, lng: -74.0060, name: 'John Doe', skills: ['First Aid', 'Search & Rescue'] },
    { id: 2, lat: 40.7589, lng: -73.9851, name: 'Jane Smith', skills: ['Medical', 'Communications'] },
    { id: 3, lat: 40.6892, lng: -74.0445, name: 'Mike Johnson', skills: ['Engineering', 'Transportation'] },
  ];

  const resourceHubs = [
    { id: 1, lat: 40.7414, lng: -74.0055, name: 'Emergency Supply Center', resources: ['Food', 'Water', 'Blankets'] },
    { id: 2, lat: 40.7282, lng: -73.9942, name: 'Medical Station', resources: ['Medical Supplies', 'First Aid'] },
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

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Disaster Map</h1>
            <p className="text-gray-600">Real-time monitoring and resource coordination</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-disaster-600" />
              <span className="text-sm font-medium">{activeAlerts.length} Active Alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">{volunteers.length} Volunteers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{resourceHubs.length} Resource Hubs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-disaster-600 rounded-full"></div>
            <span>Disaster Zones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Volunteers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Resource Hubs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full opacity-30"></div>
            <span>Affected Radius</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
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
                    <h3 className="font-bold text-disaster-800">{alert.title}</h3>
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

          {/* Volunteers */}
          {volunteers.map((volunteer) => (
            <Marker
              key={volunteer.id}
              position={[volunteer.lat, volunteer.lng]}
              icon={new Icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9L13 9V7L11 7V9L9 9V7L7 7V9L5 9C3.9 9 3 9.9 3 11V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V11C21 9.9 20.1 9 19 9H21Z"/>
                  </svg>
                `),
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-blue-800">{volunteer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Volunteer</p>
                  <div className="text-xs">
                    <div className="font-medium">Skills:</div>
                    <div>{volunteer.skills.join(', ')}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Resource Hubs */}
          {resourceHubs.map((hub) => (
            <Marker
              key={hub.id}
              position={[hub.lat, hub.lng]}
              icon={new Icon({
                iconUrl: 'data:image/svg+xml;base64=' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#16a34a" width="24" height="24">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                  </svg>
                `),
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-green-800">{hub.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Resource Hub</p>
                  <div className="text-xs">
                    <div className="font-medium">Available:</div>
                    <div>{hub.resources.join(', ')}</div>
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