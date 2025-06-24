import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Camera, Phone, Clock, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ReportIncident: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    severity: 'medium',
    title: '',
    description: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    peopleAffected: '',
    immediateHelp: false,
    contactNumber: '',
    images: [] as File[]
  });

  const disasterTypes = [
    { id: 'earthquake', label: 'Earthquake', icon: '🌍' },
    { id: 'flood', label: 'Flood', icon: '🌊' },
    { id: 'fire', label: 'Fire', icon: '🔥' },
    { id: 'storm', label: 'Storm/Hurricane', icon: '🌪️' },
    { id: 'landslide', label: 'Landslide', icon: '🏔️' },
    { id: 'accident', label: 'Accident', icon: '🚗' },
    { id: 'other', label: 'Other Emergency', icon: '⚠️' }
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800', description: 'Minor incident, no immediate danger' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate impact, some assistance needed' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Serious incident, urgent response needed' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Life-threatening emergency' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to Firebase
    console.log('Incident reported:', formData);
    alert('Incident reported successfully! Emergency responders have been notified.');
    navigate('/dashboard');
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        // In production, reverse geocode to get address
        setFormData(prev => ({ ...prev, location: 'Current Location Detected' }));
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-disaster-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Report Emergency Incident</h1>
                <p className="text-disaster-100">Provide details to help emergency responders</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Emergency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {disasterTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.type === type.id
                        ? 'border-disaster-500 bg-disaster-50 text-disaster-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Severity Level
              </label>
              <div className="space-y-2">
                {severityLevels.map((level) => (
                  <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level.id}
                      checked={formData.severity === level.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="focus:ring-disaster-500 h-4 w-4 text-disaster-600 border-gray-300"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
                      {level.label}
                    </span>
                    <span className="text-sm text-gray-600">{level.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-disaster-500"
                  placeholder="Brief description of the incident"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  People Affected (Estimate)
                </label>
                <input
                  type="number"
                  value={formData.peopleAffected}
                  onChange={(e) => setFormData(prev => ({ ...prev, peopleAffected: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-disaster-500"
                  placeholder="Number of people affected"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-disaster-500"
                placeholder="Provide detailed information about what happened, current situation, and any immediate dangers..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-disaster-500"
                  placeholder="Enter specific address or landmark"
                />
                <button
                  type="button"
                  onClick={handleLocationDetection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Detect</span>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-disaster-500"
                    placeholder="Your contact number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.immediateHelp}
                    onChange={(e) => setFormData(prev => ({ ...prev, immediateHelp: e.target.checked }))}
                    className="h-4 w-4 text-disaster-600 focus:ring-disaster-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Immediate help required
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-gray-600">
                <Clock className="inline h-4 w-4 mr-1" />
                Emergency response team will be notified immediately
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-disaster-600 text-white font-medium rounded-lg hover:bg-disaster-700 focus:outline-none focus:ring-2 focus:ring-disaster-500 focus:ring-offset-2"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};