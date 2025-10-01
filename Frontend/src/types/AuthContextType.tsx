export interface IUser {
  _id: string;
  email: string;
  name: string;
}
export interface IAuthContextType {
  user: IUser | null;
  loading: boolean;
  registerUser: (userData: IUser) => void;
  login: (userData: IUser) => void;
  logout: () => Promise<void>;
}
