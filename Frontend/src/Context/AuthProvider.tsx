import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextType, User } from '../types/AuthContextType';
import api from '../utils/axiosInstance';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    // if (!hasLoggedIn) {
    //   setLoading(false);
    //   return;
    // }
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

  const register = (userData: User) => {
    setUser(userData);
    // localStorage.setItem("hasLoggedIn", "true")
  };

  const login = (userData: User) => {
    setUser(userData);
    // localStorage.setItem("hasLoggedIn", "true")
  };
  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
    // localStorage.removeItem("hasLoggedIn")
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
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
