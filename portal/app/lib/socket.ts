import io from 'socket.io-client';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const socket = io(`${VITE_BASE_URL}`, {
  path: '/socket.io/',
  transports: ['websocket', 'polling']
}); // Connect to your Express server

export default socket;
