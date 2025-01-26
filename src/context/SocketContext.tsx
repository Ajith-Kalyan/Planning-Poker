import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  roomId: string | null;
  setRoomId: (roomId: string) => void;
  joinRoom: (roomId: string, username: string, callback: (response: any) => void) => void;
  createRoom: (username: string, callback: (roomId: string) => void) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  roomId: null,
  setRoomId: () => {},
  joinRoom: () => {},
  createRoom: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server using socket.io-client
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, username: string, callback: (response: any) => void) => {
    if (socket) {
      socket.emit("join_room", { roomId, username }, (response: any) => {
        if (response.success) {
          setRoomId(roomId);
        }
        callback(response);
      });
    }
  };

  const createRoom = (username: string, callback: (roomId: string) => void) => {
    if (socket) {
      socket.emit("create_room", { username }, (response: { roomId: string }) => {
        if (response.roomId) {
          setRoomId(response.roomId);
          callback(response.roomId);
        }
      });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, roomId, setRoomId, joinRoom, createRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
