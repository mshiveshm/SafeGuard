import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock, Phone, Users, Package, Home, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const RequestHelp: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    helpType: '',
    urgency: 'medium',
    description: '',
    location: '',
    contactNumber: '',
    peopleCount: '1',
    specialNeeds: '',
    preferredTime: '',
    additionalInfo: ''
  });

  const helpTypes = [
    { id: 'medical', label: 'Medical Aid', icon: Heart, description: 'First aid, medical supplies, healthcare' },
    { id: 'evacuation', label: 'Evacuation', icon: Home, description: 'Safe transport and temporary shelter' },
    { id: 'supplies', label: 'Emergency Supplies', icon: Package, description: 'Food, water, clothing, blankets' },
    { id: 'rescue', label: 'Search & Rescue', icon: Users, description: 'Trapped persons, missing people' },
    { id: 'utilities', label: 'Utilities', icon: Zap, description: 'Power, water, communication restoration' },
    { id: 'other', label: 'Other', icon: Phone, description: 'Other emergency assistance' }
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800', description: 'Non-critical, can wait' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Needed within hours' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Urgent, needed soon' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Life-threatening emergency' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to Firebase and trigger volunteer matching
    console.log('Help request submitted:', formData);
    alert('Help request submitted! We are matching you with available volunteers.');
    navigate('/dashboard');
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
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
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Request Emergency Help</h1>
                <p className="text-blue-100">Connect with volunteers and emergency services</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Help Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Help Needed
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {helpTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, helpType: type.id }))}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.helpType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <type.icon className="h-6 w-6 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Urgency Level
              </label>
              <div className="space-y-2">
                {urgencyLevels.map((level) => (
                  <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.id}
                      checked={formData.urgency === level.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
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
                  Number of People
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.peopleCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, peopleCount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How many people need help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Response Time
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeframe</option>
                  <option value="immediate">Immediately</option>
                  <option value="1hour">Within 1 hour</option>
                  <option value="6hours">Within 6 hours</option>
                  <option value="24hours">Within 24 hours</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description of Help Needed
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide specific details about what help you need, your current situation, and any special requirements..."
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your current address or nearest landmark"
                />
                <button
                  type="button"
                  onClick={handleLocationDetection}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Detect</span>
                </button>
              </div>
            </div>

            {/* Contact and Special Needs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your contact number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Needs
                </label>
                <input
                  type="text"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialNeeds: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Medical conditions, disabilities, etc."
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                rows={3}
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any other relevant information that might help volunteers assist you better..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-gray-600">
                <Clock className="inline h-4 w-4 mr-1" />
                Response time depends on volunteer availability and urgency
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};