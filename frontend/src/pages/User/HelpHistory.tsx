import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User, MapPin, Phone, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HelpRequest {
  id: string;
  type: 'medical' | 'evacuation' | 'supplies' | 'rescue' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: Date;
  updatedAt: Date;
  assignedVolunteer?: {
    name: string;
    phone: string;
    rating: number;
  };
  location: string;
  resolution?: string;
  rating?: number;
  feedback?: string;
}

interface IncidentReport {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'accident' | 'other';
  title: string;
  description: string;
  status: 'submitted' | 'verified' | 'investigating' | 'resolved' | 'false-alarm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: Date;
  location: string;
  adminResponse?: string;
}

export const HelpHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'help-requests' | 'incident-reports'>('help-requests');

  // Mock data for help requests
  const helpRequests: HelpRequest[] = [
    {
      id: '1',
      type: 'medical',
      title: 'Medical Assistance for Elderly',
      description: 'Need help with medication and basic care for elderly neighbor after earthquake',
      status: 'completed',
      urgency: 'high',
      submittedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      assignedVolunteer: {
        name: 'Sarah Johnson',
        phone: '(555) 123-4567',
        rating: 4.9
      },
      location: '123 Main St, Downtown',
      resolution: 'Successfully provided medical assistance and connected with local healthcare services',
      rating: 5,
      feedback: 'Sarah was incredibly helpful and professional. She arrived quickly and knew exactly what to do.'
    },
    {
      id: '2',
      type: 'supplies',
      title: 'Emergency Food and Water',
      description: 'Family of 4 needs emergency supplies after flood damage',
      status: 'in-progress',
      urgency: 'medium',
      submittedAt: new Date(Date.now() - 3600000 * 6), // 6 hours ago
      updatedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      assignedVolunteer: {
        name: 'Mike Chen',
        phone: '(555) 987-6543',
        rating: 4.7
      },
      location: '456 Oak Ave, Riverside'
    },
    {
      id: '3',
      type: 'evacuation',
      title: 'Transportation to Shelter',
      description: 'Need safe transport for disabled family member to emergency shelter',
      status: 'pending',
      urgency: 'high',
      submittedAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000 * 1),
      location: '789 Pine St, Industrial Area'
    }
  ];

  // Mock data for incident reports
  const incidentReports: IncidentReport[] = [
    {
      id: '1',
      type: 'flood',
      title: 'Street Flooding on Main Street',
      description: 'Heavy rainfall causing significant flooding, several cars stranded',
      status: 'resolved',
      severity: 'medium',
      submittedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      location: 'Main St between 1st and 3rd Ave',
      adminResponse: 'Emergency services dispatched. Drainage cleared and area secured. Thank you for the report.'
    },
    {
      id: '2',
      type: 'fire',
      title: 'Small Building Fire',
      description: 'Smoke visible from apartment building, possible electrical fire',
      status: 'verified',
      severity: 'high',
      submittedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      location: '321 Elm St, Apartment Complex',
      adminResponse: 'Fire department responded. Minor electrical fire contained. Building evacuated as precaution.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
      case 'verified':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      case 'submitted':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
      case 'false-alarm':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'evacuation': return '🚐';
      case 'supplies': return '📦';
      case 'rescue': return '🚑';
      case 'earthquake': return '🌍';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'storm': return '🌪️';
      case 'accident': return '🚗';
      default: return '⚠️';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help History & Reports</h1>
          <p className="text-gray-600">Track your help requests and incident reports</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'help-requests', label: 'Help Requests', count: helpRequests.length },
                { id: 'incident-reports', label: 'Incident Reports', count: incidentReports.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'help-requests' && (
              <div className="space-y-6">
                {helpRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(request.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-gray-600 mt-1">{request.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Submitted: {formatDate(request.submittedAt)}</span>
                      </div>
                    </div>

                    {request.assignedVolunteer && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-900">{request.assignedVolunteer.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-blue-700">
                                <Phone className="h-3 w-3" />
                                <span>{request.assignedVolunteer.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-blue-900">
                              {request.assignedVolunteer.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.resolution && (
                      <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-green-900 mb-2">Resolution</h4>
                        <p className="text-sm text-green-800">{request.resolution}</p>
                      </div>
                    )}

                    {request.feedback && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Your Feedback</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < (request.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{request.feedback}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'incident-reports' && (
              <div className="space-y-6">
                {incidentReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(report.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <p className="text-gray-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(report.severity)}`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Reported: {formatDate(report.submittedAt)}</span>
                      </div>
                    </div>

                    {report.adminResponse && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Official Response</h4>
                        <p className="text-sm text-blue-800">{report.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};