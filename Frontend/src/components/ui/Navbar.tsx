import { useEffect, useRef, useState } from 'react';
import { FaRegMoon } from 'react-icons/fa';
import { GiDeer } from 'react-icons/gi';
import { GoSun } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdNotificationsNone } from 'react-icons/md';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import NavbarLogoLight from '../../assets/Tubix(SVG)/1.svg';
import NavbarLogoDark from '../../assets/Tubix(SVG)/2.svg';
import { useAuth } from '../../context/AuthProvider';
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
    <nav className="bg-background border-border sticky top-0 z-50 w-full border-b transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          className="flex cursor-pointer items-center gap-3 transition-transform hover:scale-105"
          onClick={() => navigate('/home')}
          title="Go to Dashboard"
        >
          {theme === 'dark' ? (
            <img src={NavbarLogoDark} alt="Tubix Logo" className="size-35" />
          ) : (
            <img src={NavbarLogoLight} alt="Tubix Logo" className="size-35" />
          )}
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* User Info - Hidden on Mobile */}
          <div className="hidden text-right sm:block">
            <p className="text-text text-sm font-semibold">{user?.name}</p>
            <p className="text-text-muted text-xs">{user?.email}</p>
          </div>

          {/* Invites Button */}
          <button
            onClick={() => navigate('/invites')}
            className="bg-primary text-background group relative flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            title="View Invites"
          >
            <MdNotificationsNone className="h-4 w-4" />
            <span className="hidden sm:inline">Invites</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="text-text-muted bg-background-hover cursor-pointer rounded-lg p-2.5 text-xl transition-all duration-200 hover:scale-105"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FaRegMoon /> : <GoSun />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="border-border-hover group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 hover:scale-105"
              onClick={handleToggleOptions}
              title="User Menu"
            >
              {user?.avatar ? (
                <img src={user?.avatar} alt="User Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="bg-primary text-background flex h-full w-full items-center justify-center font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || <GiDeer className="h-6 w-6" />}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserOptions && (
              <div className="bg-background border-border absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border">
                {/* User Info in Dropdown - Visible on Mobile */}
                <div className="border-border border-b px-4 py-3 sm:hidden">
                  <p className="text-text text-sm font-semibold">{user?.name}</p>
                  <p className="text-text-muted text-xs">{user?.email}</p>
                </div>

                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserOptions(false);
                    }}
                    className="text-text hover:bg-background-hover flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    title="Account Settings"
                  >
                    <IoSettingsOutline className="h-4 w-4" />
                    Settings
                  </button>

                  <button
                    onClick={logout}
                    className="text-text hover:bg-background-hover hover:text-error flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
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
