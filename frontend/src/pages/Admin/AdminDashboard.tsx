import React, { useState } from 'react';
import { AlertTriangle, Users, MapPin, Activity, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { activeAlerts } = useAlerts();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock data for charts
  const alertTrends = [
    { time: '00:00', alerts: 2 },
    { time: '04:00', alerts: 1 },
    { time: '08:00', alerts: 5 },
    { time: '12:00', alerts: 8 },
    { time: '16:00', alerts: 3 },
    { time: '20:00', alerts: 4 }
  ];

  const disasterTypes = [
    { name: 'Earthquake', value: 35, color: '#ef4444' },
    { name: 'Flood', value: 25, color: '#3b82f6' },
    { name: 'Fire', value: 20, color: '#f97316' },
    { name: 'Storm', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const recentReports = [
    { id: 1, type: 'Earthquake', location: 'Downtown Area', severity: 'High', time: '5 min ago', status: 'Active' },
    { id: 2, type: 'Flood', location: 'Riverside District', severity: 'Medium', time: '15 min ago', status: 'Responding' },
    { id: 3, type: 'Fire', location: 'Industrial Zone', severity: 'Critical', time: '1 hour ago', status: 'Resolved' },
    { id: 4, type: 'Storm', location: 'Suburban Area', severity: 'Low', time: '2 hours ago', status: 'Monitoring' }
  ];

  const volunteerStats = [
    { metric: 'Active Volunteers', value: 245, change: '+12%', icon: Users, color: 'text-blue-600' },
    { metric: 'Response Time', value: '8 min', change: '-15%', icon: Clock, color: 'text-green-600' },
    { metric: 'Tasks Completed', value: 128, change: '+28%', icon: CheckCircle, color: 'text-purple-600' },
    { metric: 'Coverage Area', value: '95%', change: '+5%', icon: MapPin, color: 'text-orange-600' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'responding': return 'text-orange-600 bg-orange-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Emergency Operations Center</h1>
          <p className="text-gray-600">Real-time disaster monitoring and response coordination</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-disaster-600">{activeAlerts.length}</p>
                <p className="text-sm text-green-600">+2 in last hour</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-disaster-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Teams</p>
                <p className="text-3xl font-bold text-blue-600">18</p>
                <p className="text-sm text-blue-600">12 deployed</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Affected Areas</p>
                <p className="text-3xl font-bold text-orange-600">7</p>
                <p className="text-sm text-orange-600">3 critical zones</p>
              </div>
              <MapPin className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-3xl font-bold text-green-600">98%</p>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <Activity className="h-12 w-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Alert Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Alert Trends</h2>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Disaster Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Disaster Types</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disasterTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {disasterTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {disasterTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                    <span>{type.name}</span>
                  </div>
                  <span className="font-medium">{type.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{report.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{report.location}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{report.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Volunteer Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Volunteer Stats</h2>
            <div className="space-y-6">
              {volunteerStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.metric}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Manage Volunteers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};