import { useState } from 'react';
import { GiDeer } from 'react-icons/gi';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthProvider';
import TubixLogo from '../../assets/Tubix(SVG)/2.svg';
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log(user);

  const [showUserOptions, setShowUserOptions] = useState(false);
  return (
    <div className="flex w-full justify-center p-4">
      <nav className="mt-3 flex w-3/4 items-center justify-around rounded-2xl bg-neutral-900 p-4 text-xl text-gray-300 shadow-xl shadow-indigo-900/30 ring-1 ring-white/10">
        <button
          className="cursor-pointer"
          onClick={() => {
            navigate('/home');
          }}
        >
          <img src={TubixLogo} alt="tubix-logo" className="w-50 h-25 object-cover" />
        </button>
        <div className="text-left">
          <p className="font-display text-2xl font-bold text-white">{user?.name}</p>
          <p className="font-sans text-xs text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={() => {
            navigate('/invites');
          }}
          className="relative cursor-pointer rounded-lg bg-indigo-600 px-6 py-2 font-bold text-white shadow-lg shadow-indigo-500/40"
        >
          Invites
        </button>
        <button
          className="size-15 border-1 relative flex cursor-pointer items-center justify-center rounded-full border-white"
          onClick={() => {
            setShowUserOptions(!showUserOptions);
          }}
        >
          {user?.avatar === '' ? (
            <GiDeer className="size-10" />
          ) : (
            <img src={user?.avatar} alt="user-logo" className="size-10" />
          )}
          <IoIosArrowDropdownCircle className="absolute -bottom-2 right-0 fill-white" />
        </button>
        {showUserOptions && (
          <ul>
            <li>
              <button className="rounded-xl px-4 py-2 font-medium text-gray-500" onClick={logout}>
                Logout {<TbLogout2 />}
              </button>
            </li>
            <li>
              <button className="rounded-xl px-4 py-2 font-medium text-gray-500" onClick={logout}>
                Setting {<IoSettingsOutline />}
              </button>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
