import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import {
  ToastProvider,
} from './context/ToastContext';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import UserStores from './pages/UserStores';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAddUser from './pages/AdminAddUser';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';

import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />

            <main className="app-main">
              <Routes>
                <Route
                  path="/"
                  element={<Landing />}
                />

                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/signup"
                  element={<Signup />}
                />

                <Route
                  path="/update-password"
                  element={
                    <PrivateRoute>
                      <UpdatePassword />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/stores"
                  element={
                    <PrivateRoute
                      roles={['user']}
                    >
                      <UserStores />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/owner"
                  element={
                    <PrivateRoute
                      roles={['owner']}
                    >
                      <OwnerDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminUsers />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/users/:id"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminUserDetail />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/users/add"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminAddUser />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/stores"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminStores />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/stores/add"
                  element={
                    <PrivateRoute
                      roles={['admin']}
                    >
                      <AdminAddStore />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />
              </Routes>
            </main>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;