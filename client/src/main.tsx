import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register.tsx';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root route - redirect to dashboard if logged in, else to login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* Login route - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* Register route - redirect to dashboard if already logged in */}
        <Route
          path="/register"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />
          }
        />

        {/* Dashboard route - protected, redirect to login if not authenticated */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all route - redirect unmatched paths to home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
