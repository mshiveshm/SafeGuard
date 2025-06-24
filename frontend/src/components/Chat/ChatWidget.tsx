import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, MapPin, Phone, User, Shield, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../hooks/useSocket';

interface Message {
  id: string;
  senderId: string;
  senderRole: 'user' | 'admin' | 'volunteer';
  content: string;
  type: 'text' | 'location';
  location?: { latitude: number; longitude: number; address: string };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const { socket, isConnected, joinRoom, sendMessage, shareLocation, startTyping, stopTyping } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const roomId = `room_${user?.id}_admin1`;
  const participant = {
    id: 'admin1',
    name: 'Emergency Coordinator',
    role: 'admin' as const,
    status: 'online' as const
  };

  useEffect(() => {
    if (socket && isConnected && isOpen) {
      console.log('Joining room from widget:', roomId);
      joinRoom(roomId, participant.id);

      // Listen for chat events
      socket.on('chat_history', (history: Message[]) => {
        console.log('Received chat history:', history);
        setMessages(history.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      });

      socket.on('new_message', (message: Message) => {
        console.log('Received new message:', message);
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

      return () => {
        socket.off('chat_history');
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('message_status');
      };
    }
  }, [socket, isConnected, isOpen, roomId, participant.id, joinRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    console.log('Sending message from widget:', newMessage);
    sendMessage(roomId, newMessage);
    setNewMessage('');
    stopTyping(roomId);
    setIsTyping(false);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'volunteer': return <User className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          1
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            {getRoleIcon(participant.role)}
          </div>
          <div>
            <h3 className="font-semibold">{participant.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <span className="capitalize">{participant.role}</span>
              <span>•</span>
              <span className={isConnected ? 'text-green-200' : 'text-red-200'}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
        {messages.length === 0 && isConnected && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Start a conversation with the emergency coordinator</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-xs lg:max-w-md">
              {message.senderId !== user?.id && (
                <div className="flex items-center space-x-1 mb-1 text-xs text-purple-600">
                  {getRoleIcon(message.senderRole)}
                  <span className="capitalize">{message.senderRole}</span>
                </div>
              )}
              
              <div
                className={`px-4 py-2 rounded-2xl ${
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
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? '● Connected' : '● Connecting...'}
          </span>
        </div>
      </div>
    </div>
  );
};