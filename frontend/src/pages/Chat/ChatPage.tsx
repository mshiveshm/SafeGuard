import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Shield, User, Search, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatInterface } from '../../components/Chat/ChatInterface';

interface ChatRoom {
  id: string;
  participant: {
    id: string;
    name: string;
    role: 'user' | 'admin' | 'volunteer';
    status: 'online' | 'offline';
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    // Mock chat rooms data
    const mockRooms: ChatRoom[] = [
      {
        id: `room_${user?.id}_admin1`,
        participant: {
          id: 'admin1',
          name: 'Emergency Coordinator',
          role: 'admin',
          status: 'online'
        },
        lastMessage: {
          content: 'How can I help you today?',
          timestamp: new Date(Date.now() - 300000),
          senderId: 'admin1'
        },
        unreadCount: 1
      },
      {
        id: `room_${user?.id}_volunteer1`,
        participant: {
          id: 'volunteer1',
          name: 'Sarah Johnson',
          role: 'volunteer',
          status: 'online'
        },
        lastMessage: {
          content: 'I\'m on my way to your location',
          timestamp: new Date(Date.now() - 600000),
          senderId: 'volunteer1'
        },
        unreadCount: 0
      }
    ];

    setChatRooms(mockRooms);
  }, [user?.id]);

  const filteredRooms = chatRooms.filter(room =>
    room.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'volunteer': return <User className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Chat List Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                  Messages
                </h1>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chat Rooms List */}
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a chat with an emergency coordinator</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full p-4 text-left rounded-lg transition-colors ${
                        selectedRoom?.id === room.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(room.participant.role)}
                          <span className="font-medium text-gray-900">
                            {room.participant.name}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            room.participant.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        </div>
                        {room.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {room.lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                            {room.lastMessage.content}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatTime(room.lastMessage.timestamp)}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <ChatInterface
                roomId={selectedRoom.id}
                participant={selectedRoom.participant}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a chat from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start New Chat</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Create new chat with admin
                  setShowNewChatModal(false);
                }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Emergency Coordinator</p>
                  <p className="text-sm text-gray-500">Get immediate assistance</p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  // Create new chat with volunteer
                  setShowNewChatModal(false);
                }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Available Volunteer</p>
                  <p className="text-sm text-gray-500">Connect with nearby help</p>
                </div>
              </button>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewChatModal(false)}
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