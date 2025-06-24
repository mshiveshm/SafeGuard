import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, participantId?: string) => void;
  sendMessage: (roomId: string, message: string, type?: 'text' | 'location') => void;
  shareLocation: (roomId: string, location: { latitude: number; longitude: number; address: string }) => void;
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  flagEmergency: (roomId: string, messageId: string, reason: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('No user found, not connecting to socket');
      return;
    }

    console.log('Connecting to socket server with user:', user);

    // Construct the socket URL with explicit http protocol to avoid wss/ws mismatch
    const socketUrl = 'http://' + window.location.hostname + ':3001';
    console.log('Connecting to socket URL:', socketUrl);

    // Initialize socket connection
    const socket = io(socketUrl, {
      auth: {
        userId: user.id,
        userRole: user.role
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat server with socket ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      console.log('Cleaning up socket connection');
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user]);

  const joinRoom = (roomId: string, participantId?: string) => {
    console.log('Joining room:', roomId, 'with participant:', participantId);
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_chat', { roomId, participantId });
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  };

  const sendMessage = (roomId: string, message: string, type: 'text' | 'location' = 'text') => {
    console.log('Sending message to room:', roomId, 'message:', message);
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', { roomId, message, type });
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  };

  const shareLocation = (roomId: string, location: { latitude: number; longitude: number; address: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('share_location', { roomId, ...location });
    }
  };

  const startTyping = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing_start', { roomId });
    }
  };

  const stopTyping = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing_stop', { roomId });
    }
  };

  const flagEmergency = (roomId: string, messageId: string, reason: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('flag_emergency', { roomId, messageId, reason });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    sendMessage,
    shareLocation,
    startTyping,
    stopTyping,
    flagEmergency
  };
};