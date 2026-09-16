import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Store Ratings</Link>
      <div className="nav-links">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user?.role === 'user' && <Link to="/stores">Stores</Link>}
        {user?.role === 'owner' && <Link to="/owner/dashboard">My Store</Link>}
        {user && <Link to="/update-password">Change Password</Link>}
        {user ? (
          <button className="link-btn" onClick={handleLogout}>Logout ({user.name.split(' ')[0]})</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
