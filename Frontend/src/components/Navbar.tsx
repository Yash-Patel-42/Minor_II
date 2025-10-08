import { useAuth } from '../Context/AuthProvider';
import Inbox from './Inbox';
function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex justify-center">
      <nav className="flex bg-gray-800 text-white text-xl justify-around p-2 w-3/4 rounded-4xl mt-3 items-center">
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <Inbox />
        <button
          className="font-semibold bg-red-400 hover:bg-red-600 border-1 border-white rounded-xl p-1"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
