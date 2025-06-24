import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  AlertTriangle, 
  Heart, 
  MapPin, 
  Bell, 
  MessageCircle, 
  History, 
  Users, 
  Settings,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../../contexts/AlertContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { activeAlerts } = useAlerts();
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home, 
      description: 'Overview and quick actions',
      color: 'text-blue-600'
    },
    { 
      name: 'Report Incident', 
      path: '/report', 
      icon: AlertTriangle, 
      description: 'Report emergency situations',
      color: 'text-red-600',
      urgent: true
    },
    { 
      name: 'Request Help', 
      path: '/help', 
      icon: Heart, 
      description: 'Get assistance from volunteers',
      color: 'text-pink-600'
    },
    { 
      name: 'Live Map', 
      path: '/map', 
      icon: MapPin, 
      description: 'View disaster zones and safe areas',
      color: 'text-green-600'
    },
    { 
      name: 'Alerts', 
      path: '/alerts', 
      icon: Bell, 
      description: 'Emergency notifications',
      color: 'text-orange-600',
      badge: activeAlerts.length > 0 ? activeAlerts.length : null
    },
    { 
      name: 'Chat', 
      path: '/chat', 
      icon: MessageCircle, 
      description: 'Communicate with responders',
      color: 'text-purple-600'
    },
    { 
      name: 'History', 
      path: '/history', 
      icon: History, 
      description: 'View past requests and reports',
      color: 'text-gray-600'
    }
  ];

  const adminItems = [
    { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: Shield, 
      description: 'Emergency operations center',
      color: 'text-indigo-600'
    },
    { 
      name: 'Volunteer Portal', 
      path: '/volunteer', 
      icon: Users, 
      description: 'Manage volunteer activities',
      color: 'text-teal-600'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">SafeGuard</h2>
              <p className="text-sm text-gray-500">Emergency Response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors
                  ${isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <item.icon className={`h-5 w-5 ${isActive(item.path) ? item.color : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>

                {/* Badges */}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse">
                    {item.badge}
                  </span>
                )}
                
                {item.urgent && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                    URGENT
                  </span>
                )}

                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            ))}

            {/* Admin/Volunteer Section */}
            {(user?.role === 'admin' || user?.role === 'volunteer') && (
              <>
                <div className="px-4 py-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {user.role === 'admin' ? 'Administration' : 'Volunteer Tools'}
                  </h3>
                </div>
                
                {adminItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      group flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative
                      ${isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors
                      ${isActive(item.path) 
                        ? 'bg-indigo-100' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                      }
                    `}>
                      <item.icon className={`h-5 w-5 ${isActive(item.path) ? item.color : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>

                    {isActive(item.path) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                    )}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 mr-3 text-gray-500" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};