import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ email: '', role: '' });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUserInfo(res.data))
      .catch((err) => {
        // Only logout if 401/403
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/');
        }
      });

    // Fetch Wallet Balance
    axios.get('http://localhost:5000/api/wallet/balance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(0));

  }, []);

  const handleRecharge = () => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Adding funds...');

    axios.post('http://localhost:5000/api/wallet/recharge', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        toast.dismiss(loadingToast);
        toast.success(res.data.msg);
        setBalance(res.data.balance);
      })
      .catch(() => {
        toast.dismiss(loadingToast);
        toast.error('Recharge failed');
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 50 } }
  } as const;

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                Welcome back, {userInfo.email ? userInfo.email.split('@')[0] : 'User'}!
              </h1>
              <p className="text-indigo-200 text-lg">
                Manage your journeys and profile from here.
                {userInfo.role && <span className="ml-2 bg-indigo-800 px-3 py-1 rounded-full text-xs uppercase tracking-wide">{userInfo.role}</span>}
              </p>
            </div>

            {/* Wallet Widget */}
            <div className="bg-indigo-800 p-4 rounded-xl shadow-lg border border-indigo-600 text-center min-w-[150px]">
              <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider mb-1">E-Rupee Balance</p>
              <p className="text-3xl font-bold text-white mb-2">₹{balance}</p>
              <button
                onClick={handleRecharge}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded w-full mt-2 transition-colors"
              >
                Recharge ₹100
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Book Ticket Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/book')}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-t-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">🎫</span>
              </div>
              <span className="text-blue-500 font-semibold text-sm">New Journey</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Book a Ticket</h3>
            <p className="text-gray-500">Plan your next trip with ease. Railway, Metro, or Events.</p>
          </motion.div>

          {/* My Bookings Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mybookings')}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-t-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">📄</span>
              </div>
              <span className="text-green-500 font-semibold text-sm">History</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Bookings</h3>
            <p className="text-gray-500">View and manage your past and upcoming bookings.</p>
          </motion.div>

          {/* Admin Panel Card (Conditional) */}
          {userInfo.email === 'admin@example.com' && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer border-t-4 border-purple-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">⚙️</span>
                </div>
                <span className="text-purple-500 font-semibold text-sm">Admin</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Panel</h3>
              <p className="text-gray-500">Manage users, system settings, and reports.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
