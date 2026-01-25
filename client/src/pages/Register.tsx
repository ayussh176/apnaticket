import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'major',
    panOrAadhaar: '',
    guardianPan: '',
  });
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrorMsg(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    setMsg('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);

      console.log('Registration successful, token received:', res.data.token);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);

      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      console.log('Token stored in localStorage:', !!storedToken);

      // Show success message
      setMsg('Registration successful! Redirecting to dashboard...');

      // Use window.location for more reliable redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.msg || 'Registration failed';
      setErrorMsg(errorMessage);
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-96 border p-8 rounded shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">User Type</label>
          <select
            name="role"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="major">Major (Adult)</option>
            <option value="minor">Minor (Child)</option>
            <option value="guardian">Guardian</option>
          </select>
        </div>

        {/* PAN or Aadhaar */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {form.role === 'minor' ? 'Aadhaar Number (12 digits)' : 'PAN Number (Format: ABCDE1234567Z)'}
          </label>
          <input
            name="panOrAadhaar"
            placeholder={form.role === 'minor' ? 'e.g., 123456789012' : 'e.g., ABCDE1234567Z'}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.panOrAadhaar}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {form.role === 'minor' 
              ? 'Enter your 12-digit Aadhaar number' 
              : 'Format: 5 letters, 7 digits, 1 letter (e.g., ABCDE1234567Z)'}
          </p>
        </div>

        {/* Guardian PAN (only for minors) */}
        {form.role === 'minor' && (
          <div>
            <label className="block text-sm font-medium mb-1">Guardian PAN Number</label>
            <input
              name="guardianPan"
              placeholder="e.g., ABCDE1234567Z"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.guardianPan}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: 5 letters, 7 digits, 1 letter
            </p>
          </div>
        )}

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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
