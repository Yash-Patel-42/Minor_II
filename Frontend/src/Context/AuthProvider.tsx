import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { IAuthContextType, IUser } from "../types/AuthContextType";
import api from "../utils/axiosInstance";

interface ChannelInfo {
  channelName: string;
  channelDescription: string;
  subscribers: string;
  views: string;
  totalVideos: string;
  thumbnails?: Record<string, { url: string }>;
}

interface ExtendedAuthContextType extends IAuthContextType {
  channelInfo: ChannelInfo | null;
  fetchYouTubeChannelInfo: (workspaceId: string) => Promise<void>;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto check auth on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post(
          "/users/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
        console.log(res.data.user);
      } catch (error) {
        setUser(null);
        console.error("Auth refresh failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Function to fetch YouTube channel info for a workspace
  const fetchYouTubeChannelInfo = useCallback(async (workspaceId: string) => {
    if (!workspaceId) return;
    try {
      const res = await api.get(`/channel/info/${workspaceId}`, {
        params: {
          workspaceId,
        },
        withCredentials: true,
      });
      setChannelInfo(res.data.channel);
    } catch (err) {
      console.error("Failed to fetch YouTube channel info:", err);
      setChannelInfo(null);
    }
  }, []);

  const registerUser = (userData: IUser) => setUser(userData);
  const login = (userData: IUser) => setUser(userData);
  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
    setChannelInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        login,
        logout,
        channelInfo,
        fetchYouTubeChannelInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
