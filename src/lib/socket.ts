import { io } from "socket.io-client";

// For a real implementation, this would point to your actual Socket.io server
// In this demo, we'll simulate real-time functionality locally
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});

export const connectSocket = (userId: string) => {
  if (!socket.connected) {
    socket.auth = { userId };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// For demo purposes, we'll simulate socket events
export const simulateSocketEvents = () => {
  // This is just for demonstration - in a real app, these would be actual socket events
  return {
    emitFriendRequest: (friendId: string) => {
      console.log(`Friend request sent to ${friendId}`);
      // In a real app: socket.emit('friend:request', { friendId });
      return Promise.resolve({ success: true });
    },
    emitFriendAccept: (friendId: string) => {
      console.log(`Friend request accepted for ${friendId}`);
      // In a real app: socket.emit('friend:accept', { friendId });
      return Promise.resolve({ success: true });
    },
    emitGameInvite: (friendId: string, roomCode: string) => {
      console.log(`Game invite sent to ${friendId} for room ${roomCode}`);
      // In a real app: socket.emit('game:invite', { friendId, roomCode });
      return Promise.resolve({ success: true });
    },
  };
};
