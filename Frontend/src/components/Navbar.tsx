import { useNavigate } from 'react-router';
import { useAuth } from '../Context/AuthProvider';
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <div className="flex justify-center">
      <nav className="mt-3 flex w-3/4 items-center justify-around rounded-4xl bg-gray-800 p-2 text-xl text-white">
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <button
          onClick={() => {
            navigate('/invites');
          }}
          className="rounded-lg bg-green-400 p-2"
        >
          Invites
        </button>
        <button
          className="rounded-xl border-1 border-white bg-red-400 p-1 font-semibold hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
