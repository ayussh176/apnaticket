import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { History } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

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

    axios.get(`${import.meta.env.VITE_API_BASE}/api/auth/me`, {
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
    axios.get(`${import.meta.env.VITE_API_BASE}/api/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(0));

  }, []);

  const handleRecharge = () => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Adding funds...');

    axios.post(`${import.meta.env.VITE_API_BASE}/api/wallet/recharge`, {}, {
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

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch Recent Bookings
    axios.get(`${import.meta.env.VITE_API_BASE}/api/book`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Sort by date desc and take top 3
        const sorted = res.data.bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
        setRecentBookings(sorted);
        setLoadingBookings(false);
      })
      .catch(() => setLoadingBookings(false));
  }, []);

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

        {/* Recent Bookings Section */}
        <motion.div variants={itemVariants} className="mt-10 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <History className="mr-2 text-indigo-600" /> Recent Activity
          </h3>

          {loadingBookings ? (
            <div className="flex justify-center py-8">
              <Spinner size={30} color="border-indigo-600" />
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent bookings found.</p>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${booking.bookingType === 'railway' ? 'bg-blue-100 text-blue-600' :
                        booking.bookingType === 'metro' ? 'bg-purple-100 text-purple-600' :
                          'bg-pink-100 text-pink-600'
                        }`}>
                        {booking.bookingType === 'railway' ? '🚂' : booking.bookingType === 'metro' ? '🚇' : '🎫'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{booking.bookingType} Ticket</p>
                        <p className="text-xs text-gray-500">{new Date(booking.journeyDate).toLocaleDateString()} • {booking.passengerName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {booking.status}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/mybookings')}
                className="w-full text-center text-indigo-600 text-sm font-medium mt-4 hover:underline"
              >
                View All Bookings &rarr;
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
