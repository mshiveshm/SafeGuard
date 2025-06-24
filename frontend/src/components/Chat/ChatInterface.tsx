import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, AlertTriangle, Phone, User, Clock, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../hooks/useSocket';

interface Message {
  id: string;
  senderId: string;
  senderRole: 'user' | 'admin' | 'volunteer';
  content: string;
  type: 'text' | 'location' | 'emergency';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatParticipant {
  id: string;
  name: string;
  role: 'user' | 'admin' | 'volunteer';
  status: 'online' | 'offline';
  avatar?: string;
}

interface ChatInterfaceProps {
  roomId: string;
  participant: ChatParticipant;
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ roomId, participant, onClose }) => {
  const { user } = useAuth();
  const { socket, isConnected, joinRoom, sendMessage, shareLocation, startTyping, stopTyping, flagEmergency } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showEmergencyFlag, setShowEmergencyFlag] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (socket && isConnected) {
      joinRoom(roomId, participant.id);

      // Listen for chat events
      socket.on('chat_history', (history: Message[]) => {
        setMessages(history.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      });

      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, {
          ...message,
          timestamp: new Date(message.timestamp)
        }]);
      });

      socket.on('user_typing', ({ userId, isTyping: typing }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (typing) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      socket.on('message_status', ({ messageId, status }) => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ));
      });

      socket.on('emergency_flagged_ack', ({ messageId }) => {
        setShowEmergencyFlag(null);
        // Show success notification
      });

      return () => {
        socket.off('chat_history');
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('message_status');
        socket.off('emergency_flagged_ack');
      };
    }
  }, [socket, isConnected, roomId, participant.id, joinRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    sendMessage(roomId, newMessage);
    setNewMessage('');
    stopTyping(roomId);
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      startTyping(roomId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(roomId);
    }, 1000);
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        shareLocation(roomId, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Current Location'
        });
      });
    }
  };

  const handleFlagEmergency = (messageId: string) => {
    flagEmergency(roomId, messageId, 'User marked as emergency');
    setShowEmergencyFlag(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-blue-400" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-green-400" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600';
      case 'volunteer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'volunteer': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {getRoleIcon(participant.role)}
          </div>
          <div>
            <h3 className="font-semibold">{participant.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <span className="capitalize">{participant.role}</span>
              <span>•</span>
              <span className={participant.status === 'online' ? 'text-green-200' : 'text-gray-300'}>
                {participant.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
          Connecting to chat server...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-xs lg:max-w-md">
              {message.senderId !== user?.id && (
                <div className={`flex items-center space-x-1 mb-1 text-xs ${getRoleColor(message.senderRole)}`}>
                  {getRoleIcon(message.senderRole)}
                  <span className="capitalize">{message.senderRole}</span>
                </div>
              )}
              
              <div
                className={`px-4 py-2 rounded-2xl relative group ${
                  message.senderId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'location' ? (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Location Shared</p>
                      <p className="text-xs opacity-75">{message.location?.address}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                
                <div className={`flex items-center justify-between mt-1 text-xs ${
                  message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.senderId === user?.id && (
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(message.status)}
                    </div>
                  )}
                </div>

                {/* Emergency Flag Button */}
                {message.senderId !== user?.id && (
                  <button
                    onClick={() => setShowEmergencyFlag(message.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">
                  {participant.name} is typing...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareLocation}
            className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Share location"
          >
            <MapPin className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Emergency hotline: 911</span>
          <button
            onClick={() => setShowEmergencyFlag('new')}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Mark as Urgent</span>
          </button>
        </div>
      </div>

      {/* Emergency Flag Modal */}
      {showEmergencyFlag && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Flag as Emergency</h3>
            <p className="text-gray-600 mb-4">
              This will immediately notify all emergency coordinators. Use only for urgent situations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleFlagEmergency(showEmergencyFlag)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Flag Emergency
              </button>
              <button
                onClick={() => setShowEmergencyFlag(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};