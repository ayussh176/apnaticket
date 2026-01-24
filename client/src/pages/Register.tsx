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
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', form);
    localStorage.setItem('token', res.data.token); // Store token
    setMsg('✅ Registered successfully!');
    setTimeout(() => navigate('/dashboard'), 1500); // Go to dashboard
  } catch (err: any) {
    setMsg(err.response?.data?.msg || 'Registration failed');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80 border p-6 rounded shadow">
        <h1 className="text-xl font-bold">Register</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full border p-2 rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="guardian">Guardian</option>
        </select>

        <input
          name="panOrAadhaar"
          placeholder={
            form.role === 'minor' ? 'Aadhaar Number' : 'PAN Number'
          }
          className="w-full border p-2 rounded"
          value={form.panOrAadhaar}
          onChange={handleChange}
          required
        />

        {form.role === 'minor' && (
          <input
            name="guardianPan"
            placeholder="Guardian PAN Number"
            className="w-full border p-2 rounded"
            value={form.guardianPan}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
        {msg && <p className="text-sm text-center text-green-700">{msg}</p>}
      </form>
    </div>
  );
}
