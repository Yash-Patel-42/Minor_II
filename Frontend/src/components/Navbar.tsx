import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useAuth } from '../Context/AuthProvider';
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <div className="flex w-full justify-center p-4">
      <nav className="mt-3 flex w-3/4 items-center justify-around rounded-2xl bg-neutral-900 p-4 text-xl text-gray-300 shadow-xl ring-1 shadow-indigo-900/30 ring-white/10">
        <div className="text-left">
          <p className="font-display text-2xl font-bold text-white">{user?.name}</p>
          <p className="font-sans text-xs text-gray-500">{user?.email}</p>
        </div>
        <motion.button
          onClick={() => {
            navigate('/invites');
          }}
          className="relative rounded-lg bg-indigo-600 px-6 py-2 font-bold text-white shadow-lg shadow-indigo-500/40"
          whileHover={{
            scale: 1.05,
            rotate: -2,
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.5)',
          }}
          whileTap={{ scale: 0.95, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          Invites
        </motion.button>
        <motion.button
          className="rounded-xl px-4 py-2 font-medium text-gray-500"
          onClick={logout}
          whileHover={{
            scale: 1.1,
            color: '#f87171',
            backgroundColor: 'rgba(153, 27, 27, 0.2)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          Logout
        </motion.button>
      </nav>
    </div>
  );
}

export default Navbar;
