import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import UserStores from './pages/UserStores';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAddUser from './pages/AdminAddUser';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';

import OwnerDashboard from './pages/OwnerDashboard';

import './App.css';

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  // Logged-in users skip the landing page and go straight to their dashboard.
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }
  // Not logged in: show the public landing page instead of forcing login.
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/update-password" element={<PrivateRoute><UpdatePassword /></PrivateRoute>} />

          <Route path="/stores" element={<PrivateRoute roles={['user']}><UserStores /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/users/new" element={<PrivateRoute roles={['admin']}><AdminAddUser /></PrivateRoute>} />
          <Route path="/admin/users/:id" element={<PrivateRoute roles={['admin']}><AdminUserDetail /></PrivateRoute>} />
          <Route path="/admin/stores" element={<PrivateRoute roles={['admin']}><AdminStores /></PrivateRoute>} />
          <Route path="/admin/stores/new" element={<PrivateRoute roles={['admin']}><AdminAddStore /></PrivateRoute>} />

          <Route path="/owner/dashboard" element={<PrivateRoute roles={['owner']}><OwnerDashboard /></PrivateRoute>} />

          <Route path="*" element={<div className="page">Page not found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}