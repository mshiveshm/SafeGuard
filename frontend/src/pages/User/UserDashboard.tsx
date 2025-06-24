import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Phone, MessageCircle, Users, Package, Clock, Shield, Bell, Activity, TrendingUp, CheckCircle, Heart, Zap, Navigation, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../../contexts/AlertContext';
import { AlertCard } from '../../components/Alerts/AlertCard';
import { UserLocationMap } from '../../components/Map/UserLocationMap';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeAlerts } = useAlerts();
  const [userStatus, setUserStatus] = useState<'safe' | 'help-requested' | 'at-risk'>('safe');
  const [helpRequestStatus, setHelpRequestStatus] = useState<'none' | 'pending' | 'approved' | 'resolved'>('none');
  const [userLocation, setUserLocation] = useState<string>('Detecting location...');
  const [nearbyDisasters, setNearbyDisasters] = useState(3);

  useEffect(() => {
    // Auto-detect user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation('Downtown, New York, NY');
        },
        (error) => {
          setUserLocation('Location unavailable');
        }
      );
    }
  }, []);

  // Mock user activity data
  const recentActivity = [
    {
      id: 1,
      type: 'alert',
      title: 'Earthquake Alert Received',
      description: 'Magnitude 6.2 earthquake detected in your area',
      time: '5 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 2,
      type: 'help',
      title: 'Help Request Submitted',
      description: 'Medical assistance requested for elderly neighbor',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'volunteer',
      title: 'Volunteer Matched',
      description: 'Sarah Johnson assigned to your help request',
      time: '3 hours ago',
      icon: Users,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const quickActions = [
    {
      title: 'Report Emergency',
      description: 'Report a disaster or emergency situation in your area',
      icon: AlertTriangle,
      link: '/report',
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      urgent: true,
      badge: 'URGENT'
    },
    {
      title: 'Request Help',
      description: 'Get immediate assistance from volunteers and emergency services',
      icon: Heart,
      link: '/help',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      badge: helpRequestStatus === 'pending' ? 'PENDING' : null
    },
    {
      title: 'Live Disaster Map',
      description: 'View real-time disaster information and safe routes',
      icon: MapPin,
      link: '/map',
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Emergency Chat',
      description: 'Connect with emergency coordinators and volunteers',
      icon: MessageCircle,
      link: '/chat',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const helpRequests = [
    {
      id: '1',
      type: 'Medical Assistance',
      status: 'In Progress',
      volunteer: 'Sarah Johnson',
      submittedAt: '2 hours ago',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '2',
      type: 'Emergency Supplies',
      status: 'Completed',
      volunteer: 'Mike Chen',
      submittedAt: '1 day ago',
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  const safetyTips = [
    {
      title: 'Emergency Kit Ready',
      description: 'Keep emergency supplies stocked with water, food, and first aid',
      completed: true
    },
    {
      title: 'Evacuation Routes',
      description: 'Know your evacuation routes and family meeting points',
      completed: true
    },
    {
      title: 'Emergency Contacts',
      description: 'Update your emergency contacts and medical information',
      completed: false
    }
  ];

  const stats = [
    {
      title: 'Active Alerts',
      value: activeAlerts.length,
      change: '+2 today',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Help Requests',
      value: helpRequests.length,
      change: '+1 this week',
      changeType: 'neutral' as const,
      icon: Heart,
      color: 'bg-blue-500'
    },
    {
      title: 'Nearby Volunteers',
      value: 24,
      change: '+3 online',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Response Time',
      value: '8 min',
      change: '-2 min avg',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'help-requested': return 'text-orange-600 bg-orange-100';
      case 'at-risk': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return Shield;
      case 'help-requested': return Clock;
      case 'at-risk': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold mb-3">
                  Welcome back, {user?.name}! 👋
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5" />
                    <span>{userLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Safety Status */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm`}>
                    {React.createElement(getStatusIcon(userStatus), { className: 'h-5 w-5 mr-2' })}
                    Status: {userStatus === 'safe' ? 'Safe' : userStatus === 'help-requested' ? 'Help Requested' : 'At Risk'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <action.icon className="h-8 w-8" />
                  {action.badge && (
                    <span className="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Active Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 text-red-600 mr-3 animate-pulse" />
                Active Alerts ({activeAlerts.length})
              </h2>
              <Link
                to="/alerts"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View All Alerts
                <Activity className="h-4 w-4 ml-2" />
              </Link>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {activeAlerts.slice(0, 2).map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  Live Disaster Map
                </h2>
                <p className="text-gray-600 text-sm mt-1">Real-time disaster zones and safe areas</p>
              </div>
              <UserLocationMap height="400px" showControls={false} />
            </div>

            {/* Help Request Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Heart className="h-5 w-5 text-blue-600 mr-2" />
                  Help Request Status
                </h2>
                <Link to="/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                  View History
                </Link>
              </div>
              
              {helpRequests.length > 0 ? (
                <div className="space-y-4">
                  {helpRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{request.type}</p>
                        <p className="text-sm text-gray-600">Volunteer: {request.volunteer}</p>
                        <p className="text-xs text-gray-500">Submitted {request.submittedAt}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.statusColor}`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No active help requests</p>
                  <Link
                    to="/help"
                    className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Request help now
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 text-blue-600 mr-2" />
                  Recent Activity
                </h2>
                <Link to="/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Safety Checklist */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Safety Checklist
              </h2>
              
              <div className="space-y-4">
                {safetyTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      tip.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {tip.completed ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${tip.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {tip.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/safety-guide"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Complete Safety Guide
                </Link>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 text-red-600 mr-2" />
                Emergency Contacts
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Emergency Services</span>
                  <a href="tel:911" className="text-red-600 font-bold text-lg hover:text-red-700">911</a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Local Emergency</span>
                  <a href="tel:+1234567890" className="text-red-600 font-bold hover:text-red-700">(123) 456-7890</a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Poison Control</span>
                  <a href="tel:+18002221222" className="text-red-600 font-bold hover:text-red-700">(800) 222-1222</a>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold">
                Update Emergency Contacts
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                Community Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Volunteers</span>
                  <span className="font-bold text-blue-600">245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-bold text-green-600">8 min avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Help Requests Today</span>
                  <span className="font-bold text-purple-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Coverage Area</span>
                  <span className="font-bold text-orange-600">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};