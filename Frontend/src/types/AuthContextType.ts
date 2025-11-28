export interface IUser {
  _id: string;
  email: string;
  name: string;
  avatar: string;
}
export interface IAuthContextType {
  user: IUser | null;
  loading: boolean;
  registerUser: (userData: IUser) => void;
  login: (userData: IUser) => void;
  logout: () => Promise<void>;
}
