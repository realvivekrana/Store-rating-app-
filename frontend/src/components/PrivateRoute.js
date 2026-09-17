import React from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({
  children,
  roles,
}) {
  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  if (
    Array.isArray(roles) &&
    roles.length > 0 &&
    !roles.includes(user.role)
  ) {
    if (user.role === 'admin') {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.role === 'owner') {
      return (
        <Navigate
          to="/owner"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/stores"
        replace
      />
    );
  }

  return children;
}