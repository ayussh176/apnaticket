import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e: any) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', res.data.token);
    setMsg('✅ Login successful');
    setTimeout(() => {
      navigate('/dashboard'); // go to homepage after login
    }, 1000);
  } catch (err: any) {
    setMsg(err.response?.data?.msg || 'Login failed');
  }
};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4 w-72" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {msg && <p className="text-sm text-center text-red-600">{msg}</p>}
      </form>
    </div>
  );
}
