import React, { useState } from 'react';
import { MapPin, Clock, Star, CheckCircle, AlertTriangle, Users, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const VolunteerPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');

  // Mock data for volunteer tasks
  const availableTasks = [
    {
      id: 1,
      title: 'Medical Aid Required',
      type: 'medical',
      location: '123 Main St, Downtown',
      distance: '2.3 km',
      urgency: 'high',
      description: 'Elderly person needs basic medical assistance and evacuation support',
      estimatedTime: '2-3 hours',
      skillsNeeded: ['First Aid', 'Patient Care'],
      requestedBy: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Evacuation Support',
      type: 'evacuation',
      location: '456 Oak Ave, Riverside',
      distance: '5.1 km',
      urgency: 'medium',
      description: 'Family with children needs help moving to temporary shelter',
      estimatedTime: '3-4 hours',
      skillsNeeded: ['Transportation', 'Heavy Lifting'],
      requestedBy: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Supply Distribution',
      type: 'supplies',
      location: 'Community Center, North Side',
      distance: '7.8 km',
      urgency: 'low',
      description: 'Help distribute emergency supplies to affected families',
      estimatedTime: '4-5 hours',
      skillsNeeded: ['Organization', 'Physical Work'],
      requestedBy: 'Emergency Coordinator'
    }
  ];

  const myTasks = [
    {
      id: 4,
      title: 'Search and Rescue',
      type: 'rescue',
      location: '789 Pine St, Industrial Area',
      status: 'in-progress',
      startTime: '2 hours ago',
      description: 'Searching for missing person in collapsed building area',
      estimatedTime: '6-8 hours',
      assignedTeam: ['John Doe', 'Jane Smith']
    }
  ];

  const completedTasks = [
    {
      id: 5,
      title: 'First Aid Station',
      type: 'medical',
      location: 'Downtown Emergency Center',
      completedTime: '1 day ago',
      duration: '6 hours',
      rating: 5,
      feedback: 'Excellent work! Very professional and caring.'
    },
    {
      id: 6,
      title: 'Food Distribution',
      type: 'supplies',
      location: 'Shelter #3',
      completedTime: '3 days ago',
      duration: '4 hours',
      rating: 4,
      feedback: 'Great help with organizing supplies efficiently.'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'evacuation': return '🚐';
      case 'supplies': return '📦';
      case 'rescue': return '🚑';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Volunteer Portal</h1>
              <p className="text-gray-600">Make a difference in your community</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Hours Volunteered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">4.9 Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'available', label: 'Available Tasks', count: availableTasks.length },
                { id: 'my-tasks', label: 'My Tasks', count: myTasks.length },
                { id: 'completed', label: 'Completed', count: completedTasks.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          <div className="p-6">
            {activeTab === 'available' && (
              <div className="space-y-6">
                {availableTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(task.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(task.urgency)}`}>
                        {task.urgency.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location} ({task.distance})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Est. {task.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Skills needed:</div>
                        <div className="flex space-x-2">
                          {task.skillsNeeded.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Accept Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'my-tasks' && (
              <div className="space-y-6">
                {myTasks.map((task) => (
                  <div key={task.id} className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(task.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        IN PROGRESS
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Started {task.startTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Team members:</div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{task.assignedTeam.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Mark Complete
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-6">
                {completedTasks.map((task) => (
                  <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(task.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Completed {task.completedTime}</span>
                            <span>Duration: {task.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < task.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Feedback:</div>
                      <p className="text-sm text-gray-600 italic">"{task.feedback}"</p>
                    </div>
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