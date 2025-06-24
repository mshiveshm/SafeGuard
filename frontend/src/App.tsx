import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatWidget } from './components/Chat/ChatWidget';
import { HomePage } from './pages/HomePage';
import { UserDashboard } from './pages/User/UserDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { DisasterMap } from './pages/DisasterMap';
import { ReportIncident } from './pages/User/ReportIncident';
import { RequestHelp } from './pages/User/RequestHelp';
import { HelpHistory } from './pages/User/HelpHistory';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VolunteerPortal } from './pages/Volunteer/VolunteerPortal';
import { ChatPage } from './pages/Chat/ChatPage';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleSidebarToggle} />
      
      <div className="flex">
        {user && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={handleSidebarClose}
          />
        )}
        
        <main className={`flex-1 ${user ? 'lg:ml-0' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/map" element={<DisasterMap />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/help" element={<RequestHelp />} />
            <Route path="/history" element={<HelpHistory />} />
            <Route path="/volunteer" element={<VolunteerPortal />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
      
      {/* Chat Widget - only show when user is logged in and not on chat page */}
      {user && window.location.pathname !== '/chat' && (
        <ChatWidget 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <AppContent />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;