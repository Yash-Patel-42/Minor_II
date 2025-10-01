import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { IAuthContextType, IUser } from '../types/AuthContextType';
import api from '../utils/axiosInstance';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post('/users/refresh-token', { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const registerUser = (userData: IUser) => {
    setUser(userData);
  };

  const login = (userData: IUser) => {
    setUser(userData);
  };
  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
