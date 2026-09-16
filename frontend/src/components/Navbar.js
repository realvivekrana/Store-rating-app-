import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Close the mobile menu on route change / resize back to desktop.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = () => setOpen(false);

  const doLogout = () => {
    setConfirmOpen(false);
    closeMenu();
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <>
      <nav className="navbar">
        <div className="navbar-row">
          <NavLink to="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark">★</span> Store Ratings
          </NavLink>

          <div className="navbar-controls">
            <button
              className={`hamburger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass} onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to="/admin/users" className={linkClass} onClick={closeMenu}>Users</NavLink>
              <NavLink to="/admin/stores" className={linkClass} onClick={closeMenu}>Stores</NavLink>
            </>
          )}
          {user?.role === 'user' && <NavLink to="/stores" className={linkClass} onClick={closeMenu}>Stores</NavLink>}
          {user?.role === 'owner' && <NavLink to="/owner/dashboard" className={linkClass} onClick={closeMenu}>My Store</NavLink>}
          {user && <NavLink to="/update-password" className={linkClass} onClick={closeMenu}>Change Password</NavLink>}
          {user ? (
            <button className="link-btn logout-btn" onClick={() => setConfirmOpen(true)}>
              <span className="avatar-chip">{user.name.charAt(0).toUpperCase()}</span>
              Log out
            </button>
          ) : (
            <>
              <NavLink to="/signup" className={linkClass} onClick={closeMenu}>Sign up</NavLink>
              <NavLink to="/login" className="nav-login-btn" onClick={closeMenu}>Log in</NavLink>
            </>
          )}
          <button
            className="link-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </nav>

      <ConfirmModal
        open={confirmOpen}
        title="Log out?"
        message="You'll need to log in again to access your account."
        confirmLabel="Log out"
        onConfirm={doLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}