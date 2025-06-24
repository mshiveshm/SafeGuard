import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'volunteer';
  location?: {
    lat: number;
    lng: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('disaster_app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock authentication - in production, this would use Firebase Auth
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : email.includes('volunteer') ? 'volunteer' : 'user',
      location: { lat: 40.7128, lng: -74.0060 }
    };
    
    setUser(mockUser);
    localStorage.setItem('disaster_app_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: string = 'user') => {
    setLoading(true);
    // Mock registration - in production, this would use Firebase Auth
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: role as 'user' | 'admin' | 'volunteer',
      location: { lat: 40.7128, lng: -74.0060 }
    };
    
    setUser(mockUser);
    localStorage.setItem('disaster_app_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('disaster_app_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};