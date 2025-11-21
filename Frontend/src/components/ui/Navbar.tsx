import { useEffect, useRef, useState } from 'react';
import { FaRegMoon } from 'react-icons/fa';
import { GiDeer } from 'react-icons/gi';
import { GoSun } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import NavbarLogoLight from '../../assets/Tubix(SVG)/1.svg';
import NavbarLogoDark from '../../assets/Tubix(SVG)/2.svg';
import { useAuth } from '../../Context/AuthProvider';
import useTheme from '../../hooks/useTheme';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserOptions, setShowUserOptions] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
    <nav className="border-border-default dark:border-border-default bg-surface-base/80 dark:bg-surface-base/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate('/home')}
          title="Go to Dashboard"
        >
          {theme === 'dark' ? (
            <img src={NavbarLogoDark} alt="Tubix Logo Dark" className="h-25 w-50 object-cover" />
          ) : (
            <img src={NavbarLogoLight} alt="Tubix Logo Light" className="h-25 w-50 object-cover" />
          )}
        </button>
        <div className="flex items-center gap-4">
          {/* User Info - Hidden on mobile */}
          <div className="hidden text-right sm:block">
            <p className="text-text-primary dark:text-text-primary text-sm font-semibold">
              {user?.name}
            </p>
            <p className="text-text-tertiary dark:text-text-tertiary text-xs">{user?.email}</p>
          </div>

          {/* Invites Button */}
          <button
            onClick={() => navigate('/invites')}
            className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-95"
            title="View Invites"
          >
            Invites
          </button>

          {/* Theme Toggle */}
          <button
            className="text-text-secondary dark:text-text-secondary hover:bg-surface-raised dark:hover:bg-surface-raised hover:text-accent-600 dark:hover:text-accent-400 cursor-pointer rounded-lg p-2 text-xl transition-colors"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FaRegMoon /> : <GoSun />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="border-border-strong dark:border-border-strong hover:border-primary-500 dark:hover:border-primary-400 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 hover:shadow-sm"
              onClick={handleToggleOptions}
              title="User Menu"
            >
              {user?.avatar ? (
                <img src={user?.avatar} alt="User Avatar" className="h-9 w-9 rounded-full" />
              ) : (
                <GiDeer className="text-text-secondary dark:text-text-secondary h-6 w-6" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserOptions && (
              <div className="border-border-default dark:border-border-default bg-surface-base dark:bg-surface-base absolute right-0 mt-2 w-48 origin-top-right rounded-lg border shadow-lg ring-1 ring-black/5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-text-primary dark:text-text-primary hover:bg-surface-raised dark:hover:bg-surface-raised flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                    role="menuitem"
                    title="Account Settings"
                  >
                    <IoSettingsOutline className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="text-text-primary dark:text-text-primary hover:bg-surface-raised dark:hover:bg-surface-raised flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:text-red-600 dark:hover:text-red-400"
                    role="menuitem"
                    title="Sign Out"
                  >
                    <TbLogout2 className="h-4 w-4" />
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
