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
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
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
            <p className="text-sm font-semibold" style={{ color: 'var(--color-content)' }}>
              {user?.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
              {user?.email}
            </p>
          </div>

          {/* Invites Button */}
          <button
            onClick={() => navigate('/invites')}
            className="group relative flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            }}
            title="View Invites"
          >
            <MdNotificationsNone className="h-4 w-4" />
            <span className="hidden sm:inline">Invites</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="cursor-pointer rounded-lg p-2.5 text-xl transition-all duration-200 hover:scale-105"
            style={{
              color: 'var(--color-content-tertiary)',
              backgroundColor: 'var(--color-surface-hover)',
            }}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FaRegMoon /> : <GoSun />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'var(--color-border-hover)',
              }}
              onClick={handleToggleOptions}
              title="User Menu"
            >
              {user?.avatar ? (
                <img src={user?.avatar} alt="User Avatar" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center font-semibold"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    color: 'white',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || <GiDeer className="h-6 w-6" />}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserOptions && (
              <div
                className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border shadow-xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {/* User Info in Dropdown - Visible on Mobile */}
                <div
                  className="border-b px-4 py-3 sm:hidden"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-content)' }}>
                    {user?.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
                    {user?.email}
                  </p>
                </div>

                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserOptions(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'var(--color-content)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Account Settings"
                  >
                    <IoSettingsOutline className="h-4 w-4" />
                    Settings
                  </button>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'var(--color-content)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                      e.currentTarget.style.color = 'var(--color-error)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-content)';
                    }}
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
