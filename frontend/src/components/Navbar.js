import React, {
  useState,
} from 'react';

import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const {
    user,
    logout,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const navigate =
    useNavigate();

  const closeMobile = () =>
    setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) {
      return '/';
    }

    if (user.role === 'admin') {
      return '/admin';
    }

    if (user.role === 'owner') {
      return '/owner';
    }

    return '/stores';
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="brand"
          onClick={closeMobile}
        >
          StoreRating
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileOpen(
              (value) => !value
            )
          }
          aria-label="Toggle navigation"
          aria-expanded={
            mobileOpen
          }
        >
          ☰
        </button>

        <nav
          className={
            mobileOpen
              ? 'nav-links open'
              : 'nav-links'
          }
        >
          {user ? (
            <>
              <NavLink
                to={getDashboardPath()}
                onClick={closeMobile}
              >
                Dashboard
              </NavLink>

              {user.role ===
                'user' && (
                <NavLink
                  to="/stores"
                  onClick={
                    closeMobile
                  }
                >
                  Stores
                </NavLink>
              )}

              {user.role ===
                'admin' && (
                <>
                  <NavLink
                    to="/admin/users"
                    onClick={
                      closeMobile
                    }
                  >
                    Users
                  </NavLink>

                  <NavLink
                    to="/admin/stores"
                    onClick={
                      closeMobile
                    }
                  >
                    Stores
                  </NavLink>
                </>
              )}

              <NavLink
                to="/update-password"
                onClick={closeMobile}
              >
                Password
              </NavLink>

              <button
                type="button"
                className="nav-logout"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMobile}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                onClick={closeMobile}
              >
                Sign Up
              </NavLink>
            </>
          )}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? '☀'
              : '☾'}
          </button>
        </nav>
      </div>
    </header>
  );
}