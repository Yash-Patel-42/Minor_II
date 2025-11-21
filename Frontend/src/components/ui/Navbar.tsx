import { useEffect, useRef, useState } from 'react';
import { FaRegMoon } from 'react-icons/fa';
import { GiDeer } from 'react-icons/gi';
import { GoSun } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthProvider';
import TubixLogo from '../../assets/Tubix(SVG)/2.svg';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleOptions = () => {
    setShowUserOptions((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowUserOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="rounded-b-4xl border-b-1 sticky top-0 z-50 w-full border-white/70 bg-neutral-900/50 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between">
        <button
          className="cursor-pointer"
          onClick={() => {
            navigate('/home');
          }}
        >
          <img src={TubixLogo} alt="tubix-logo" className="h-25 w-50 object-cover" />
        </button>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="font-display text-lg font-bold text-white">{user?.name}</p>
            <p className="font-sans text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              navigate('/invites');
            }}
            className="relative cursor-pointer rounded-md bg-blue-500 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50 backdrop-blur-3xl"
          >
            Invites
          </button>
          <button
            className="cursor-pointer rounded-full p-2 text-2xl text-white"
            onClick={() => {
              setIsDarkMode(!isDarkMode);
            }}
          >
            {isDarkMode ? <FaRegMoon /> : <GoSun />}
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex size-12 items-center justify-center rounded-full border-2 border-white"
              onClick={handleToggleOptions}
            >
              {user?.avatar ? (
                <img src={user?.avatar} alt="user-logo" className="size-10 rounded-full" />
              ) : (
                <GiDeer className="size-8 fill-white" />
              )}
            </button>
            {showUserOptions && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-neutral-900/50 backdrop-blur-md">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 backdrop-blur-md hover:text-white"
                    role="menuitem"
                  >
                    <IoSettingsOutline />
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 backdrop-blur-md hover:text-white"
                    role="menuitem"
                  >
                    <TbLogout2 />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
