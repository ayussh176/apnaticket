import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Booking {
    bookingType: string;
    passengerName: string;
    journeyDate: string;
    status: string;
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        axios.get('http://localhost:5000/api/book', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBookings(res.data.bookings))
            .catch(() => setBookings([]));
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">My Bookings</h2>
                        <p className="mt-1 text-sm text-gray-500">View your travel history and upcoming trips.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/book')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors"
                    >
                        + New Booking
                    </motion.button>
                </div>

                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <span className="text-6xl">📭</span>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-2 text-gray-500">You haven't made any bookings yet.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/book')}
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Book your first ticket &rarr;
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
                    >
                        {bookings.map((b, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-lg text-blue-600">
                                            {b.bookingType === 'railway' ? '🚂' : b.bookingType === 'metro' ? '🚇' : '🎫'}
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {b.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 capitalize mb-1">{b.bookingType} Ticket</h4>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Passenger</span>
                                            <span className="font-medium text-gray-900">{b.passengerName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Date</span>
                                            <span className="font-medium text-gray-900">{new Date(b.journeyDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                    <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">View Details</button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
