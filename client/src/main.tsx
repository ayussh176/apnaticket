import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register.tsx';

const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // true if token exists
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated() ? <Dashboard /> : <Navigate to="/" />
        }
      />
    </Routes>
      {/* if token exists then go to dashboard else go to login */}
      {/* <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
        />    
        <Route path="/dashboard" element={<Dashboard />} /> */}

    {/* </Routes> */}
    </BrowserRouter>
  </StrictMode>
);
