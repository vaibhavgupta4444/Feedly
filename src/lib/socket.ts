import { io, Socket } from 'socket.io-client';
import type { Notification } from '../type';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Enable debug mode for Socket.IO
if (import.meta.env.DEV) {
  localStorage.setItem('debug', 'socket.io-client:*');
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Connecting to Socket.IO server at:', SOCKET_URL);
    console.log('Token:', token ? 'Present (length: ' + token.length + ')' : 'Missing');

    this.socket = io(SOCKET_URL, {
      path: '/socket.io/',
      query: {
        token: token,
      },
      transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      console.log('Socket ID:', this.socket?.id);
    });

    this.socket.on('connected', (data) => {
      console.log('✅ Server confirmed connection:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, attempt to reconnect
        console.log('Server disconnected, attempting to reconnect...');
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      console.error('Error message:', error.message);
      
      if (error.message.includes('404') || error.message.includes('xhr poll error')) {
        console.error('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('🚨 BACKEND SOCKET.IO NOT CONFIGURED CORRECTLY 🚨');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
        console.error('The Socket.IO endpoint is returning 404. This means:');
        console.error('');
        console.error('1. Socket.IO server is not mounted in FastAPI');
        console.error('2. Or backend is not running');
        console.error('');
        console.error('FIX: Update your backend main.py:');
        console.error('');
        console.error('from fastapi import FastAPI');
        console.error('import socketio');
        console.error('from app.sockets import sio');
        console.error('');
        console.error('app = FastAPI()');
        console.error('# ... add all your routes ...');
        console.error('');
        console.error('# IMPORTANT: Mount Socket.IO LAST');
        console.error('socket_app = socketio.ASGIApp(');
        console.error('    sio,');
        console.error('    other_asgi_app=app,');
        console.error('    socketio_path="/socket.io"');
        console.error(')');
        console.error('');
        console.error('# Export socket_app (NOT app)');
        console.error('app = socket_app');
        console.error('');
        console.error('Then run: uvicorn app.main:app --reload');
        console.error('');
        console.error('Verify: curl http://localhost:8000/socket.io/');
        console.error('Should return JSON (not 404)');
        console.error('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
      }
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
    });

    // Handle incoming notifications (backend sends 'new_notification')
    this.socket.on('new_notification', (notification: Notification) => {
      console.log('🔔 New notification received:', notification);
      this.emit('notification', notification);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: unknown) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
