import { io, Socket } from 'socket.io-client';
let socket: Socket | null = null;

export function connectSocket(token?: string, tempName?: string) {
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', { transports: ['websocket']});
  socket.on('connect', () => {
    socket?.emit('client:join', { token, tempName });
  });
  return socket;
}

export function getSocket() {
  return socket;
}
