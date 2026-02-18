import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import Spinner from '../components/ui/Spinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    setMsg('');
    setLoading(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/login`, {
        email,
        password,
      });

      console.log('Login successful, token received:', res.data.token);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);

      toast.dismiss(loadingToast);
      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (err: any) {
      setLoading(false);
      toast.dismiss(loadingToast);
      const errorMessage = err.response?.data?.msg || 'Login failed';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="space-y-4 w-96 border p-8 rounded shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg('');
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg('');
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{errorMsg}</p>
        )}

        {/* Success Message */}
        {msg && (
          <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{msg}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-medium disabled:bg-gray-400 flex justify-center items-center"
        >
          {loading ? <Spinner size={20} /> : 'Login'}
        </button>

        {/* Register Link */}
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
