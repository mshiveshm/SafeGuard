import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

// Store active connections and rooms
const activeConnections = new Map();
const chatRooms = new Map();

// Middleware to authenticate socket connections
io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  const userRole = socket.handshake.auth.userRole;
  
  if (!userId) {
    console.log('Authentication failed: No userId provided');
    return next(new Error('Authentication error'));
  }
  
  socket.userId = userId;
  socket.userRole = userRole;
  console.log(`Authentication successful for user ${userId} with role ${userRole}`);
  next();
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected with role ${socket.userRole}`);
  
  // Store active connection
  activeConnections.set(socket.userId, {
    socketId: socket.id,
    role: socket.userRole,
    status: 'online'
  });

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // If admin, join admin room
  if (socket.userRole === 'admin') {
    socket.join('admin_room');
  }

  // Handle joining chat rooms
  socket.on('join_chat', (data) => {
    console.log('Join chat request:', data);
    const { roomId, participantId } = data;
    
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
    
    // Initialize room if it doesn't exist
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, {
        participants: new Set([socket.userId, participantId]),
        messages: [],
        createdAt: new Date()
      });
    }
    
    // Send chat history
    const room = chatRooms.get(roomId);
    socket.emit('chat_history', room.messages);
    
    // Notify room about user joining
    socket.to(roomId).emit('user_joined', {
      userId: socket.userId,
      timestamp: new Date()
    });
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    const { roomId, message, type = 'text', location } = data;
    
    const messageData = {
      id: generateMessageId(),
      senderId: socket.userId,
      senderRole: socket.userRole,
      content: message,
      type,
      location,
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Store message in room
    if (chatRooms.has(roomId)) {
      chatRooms.get(roomId).messages.push(messageData);
    }
    
    // Broadcast message to room
    io.to(roomId).emit('new_message', messageData);
    console.log(`Message sent to room ${roomId}:`, messageData);
    
    // Mark as delivered
    setTimeout(() => {
      messageData.status = 'delivered';
      io.to(roomId).emit('message_status', {
        messageId: messageData.id,
        status: 'delivered'
      });
    }, 100);
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      isTyping: false
    });
  });

  // Handle emergency flagging
  socket.on('flag_emergency', (data) => {
    const { roomId, messageId, reason } = data;
    
    // Notify all admins about emergency flag
    io.to('admin_room').emit('emergency_flagged', {
      roomId,
      messageId,
      flaggedBy: socket.userId,
      reason,
      timestamp: new Date()
    });
    
    // Acknowledge to sender
    socket.emit('emergency_flagged_ack', { messageId });
  });

  // Handle location sharing
  socket.on('share_location', (data) => {
    const { roomId, latitude, longitude, address } = data;
    
    const locationMessage = {
      id: generateMessageId(),
      senderId: socket.userId,
      senderRole: socket.userRole,
      content: 'Shared location',
      type: 'location',
      location: { latitude, longitude, address },
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Store and broadcast location message
    if (chatRooms.has(roomId)) {
      chatRooms.get(roomId).messages.push(locationMessage);
    }
    
    io.to(roomId).emit('new_message', locationMessage);
  });

  // Handle read receipts
  socket.on('mark_read', (data) => {
    const { roomId, messageId } = data;
    
    socket.to(roomId).emit('message_read', {
      messageId,
      readBy: socket.userId,
      timestamp: new Date()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    activeConnections.delete(socket.userId);
    
    // Notify rooms about user going offline
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('user_offline', {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });
  });
});

// Helper functions
function generateMessageId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// API endpoints for chat management
app.get('/api/chat/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  const userRooms = [];
  
  chatRooms.forEach((room, roomId) => {
    if (room.participants.has(userId)) {
      userRooms.push({
        roomId,
        participants: Array.from(room.participants),
        lastMessage: room.messages[room.messages.length - 1],
        unreadCount: 0
      });
    }
  });
  
  res.json(userRooms);
});

app.get('/api/chat/active-users', (req, res) => {
  const activeUsers = Array.from(activeConnections.entries()).map(([userId, data]) => ({
    userId,
    status: data.status,
    role: data.role
  }));
  
  res.json(activeUsers);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});