// frontend/src/services/socket.ts
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: any = null;
  private isConnected = false;

  connect(token: string) {
    if (this.isConnected && this.socket) {
      console.log('✅ Already connected to WebSocket');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
      this.isConnected = false;
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Join channel
  joinChannel(channelId: string) {
    if (!this.socket) {
      console.warn('⚠️ Socket not connected yet');
      return;
    }
    this.socket.emit('join:channel', channelId);
  }

  // Leave channel
  leaveChannel(channelId: string) {
    if (!this.socket) return;
    this.socket.emit('leave:channel', channelId);
  }

  // Send message
  sendMessage(channelId: string, content: string, userId: number, username: string) {
    if (!this.socket) {
      console.warn('⚠️ Socket not connected');
      return;
    }
    this.socket.emit('message:send', {
      channelId,
      content,
      userId,
      username,
      timestamp: new Date()
    });
  }

  // Listen for new messages
  onMessageReceived(callback: (message: any) => void) {
    if (!this.socket) {
      console.warn('⚠️ Socket not initialized');
      return;
    }
    this.socket.on('message:new', callback);
  }

  // Update presence
  updatePresence(status: string) {
    if (!this.socket) return;
    this.socket.emit('presence:update', { status, timestamp: new Date() });
  }

  // Listen for presence changes
  onPresenceChanged(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('presence:changed', callback);
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
