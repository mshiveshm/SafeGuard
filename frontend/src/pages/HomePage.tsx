import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertCircle, Users, MapPin, Clock, CheckCircle, ArrowRight, Globe, Heart, Zap, Database, Map, UserCheck } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

export const HomePage: React.FC = () => {
  const { activeAlerts } = useAlerts();

  const features = [
    {
      icon: AlertCircle,
      title: 'Real-Time Alerts',
      description: 'Instant notifications about disasters in your area with severity levels and safety instructions',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Volunteer Coordination',
      description: 'Connect skilled volunteers with communities in need through intelligent matching algorithms',
      color: 'text-teal-600'
    },
    {
      icon: MapPin,
      title: 'Interactive Mapping',
      description: 'Live disaster tracking with safe routes, resource locations, and affected zones using Leaflet.js',
      color: 'text-cyan-600'
    },
    {
      icon: Heart,
      title: 'Resource Distribution',
      description: 'Efficient allocation and tracking of emergency supplies, medical aid, and shelter resources',
      color: 'text-blue-500'
    },
    {
      icon: Globe,
      title: 'Community Network',
      description: 'Build resilient communities through preparedness training and neighborhood response teams',
      color: 'text-teal-500'
    },
    {
      icon: Zap,
      title: 'Rapid Response',
      description: 'AI-powered prediction and automated response systems for faster emergency coordination',
      color: 'text-cyan-500'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Report or Request',
      description: 'Citizens report incidents or request help through our intuitive platform',
      icon: AlertCircle
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our system analyzes the situation and matches resources with needs automatically',
      icon: Zap
    },
    {
      step: '03',
      title: 'Coordinate Response',
      description: 'Volunteers and emergency services are dispatched with optimal routing and real-time updates',
      icon: Users
    },
    {
      step: '04',
      title: 'Track Progress',
      description: 'Monitor relief efforts in real-time with transparent progress tracking and feedback',
      icon: CheckCircle
    }
  ];

  const techFeatures = [
    {
      icon: Map,
      title: 'Leaflet.js Mapping',
      description: 'Open-source mapping without API costs'
    },
    {
      icon: UserCheck,
      title: 'Firebase Authentication',
      description: 'Secure user management and access control'
    },
    {
      icon: Database,
      title: 'Firebase Firestore',
      description: 'Real-time data synchronization across all devices'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Shield className="h-20 w-20 text-blue-600 animate-pulse" />
                <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Empowering Communities.
              </span>
              <br />
              <span className="text-gray-800">Coordinating Relief.</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Saving Lives.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Advanced disaster response platform that connects communities, coordinates volunteers, 
              and ensures rapid relief distribution when it matters most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/help"
                className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Request Help</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/volunteer"
                className="group bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join as Volunteer</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/map"
                className="group border-2 border-cyan-600 text-cyan-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <MapPin className="h-5 w-5" />
                <span>Track Disaster Live</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Emergency Monitoring</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100">
                <div className="text-3xl font-bold text-teal-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Volunteers</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-100">
                <div className="text-3xl font-bold text-cyan-600 mb-2">{activeAlerts.length}</div>
                <div className="text-gray-600">Active Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Disaster Response
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform integrates cutting-edge technology with community-driven response 
              to create the most effective disaster relief coordination system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures rapid response and efficient coordination 
              during critical emergency situations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built on Reliable Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by industry-leading open-source technologies and cloud infrastructure 
              for maximum reliability and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {techFeatures.map((tech, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of volunteers, emergency responders, and community leaders 
            who are building more resilient communities together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Contact/Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">SafeGuard</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering communities with advanced disaster response technology. 
                Building resilience through coordination, preparation, and rapid response.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center hover:bg-cyan-700 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Live Map</Link></li>
                <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Portal</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Contacts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 SafeGuard. All rights reserved. Built for community resilience.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};