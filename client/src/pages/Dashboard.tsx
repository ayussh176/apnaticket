import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    axios
      .get('http://localhost:5000/api/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessage(res.data.msg))
      .catch((err) => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-xl font-semibold">{message}</h1>
    </div>
  );
}
