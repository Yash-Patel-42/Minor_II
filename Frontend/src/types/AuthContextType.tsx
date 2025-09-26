export interface User {
  _id: string;
  email: string;
  name: string;
}
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (userData: User) => void;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}
