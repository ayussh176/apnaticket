import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // redirect to login
};

function App() {
  return (
    <div className="h-screen flex items-center justify-center text-3xl font-bold text-blue-600">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Welcome to Dashboard</h1>
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
    </div>
    
  );
}

export default App;
