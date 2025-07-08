import { io } from 'socket.io-client';

const SOCKET_URL = 'https://kanban-app-gzj0.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
}); 