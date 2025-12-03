import api from "@utils/axiosInstance";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const initSocket = async () => {
      try {
        const response = await api.post(
          "/users/refresh-token",
          {},
          { withCredentials: true }
        );
        const token = response.data.accessToken;
        const newSocket = io("http://localhost:3000", {
          auth: { token },
        });

        newSocket.on("connect", () => setConnected(true));
        newSocket.on("disconnect", () => setConnected(false));

        setSocket(newSocket);
      } catch (error) {
        console.error("Socket init failed: ", error);
      }
    };

    initSocket();

    return () => {
      socket?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
