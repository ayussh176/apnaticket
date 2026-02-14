import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Booking() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        bookingType: 'railway',
        journeyDate: '',
        passengerName: '',
        panOrAadhaar: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const processingToast = toast.loading('Confirming your booking...');

        try {
            await axios.post('http://localhost:5000/api/book', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Simulate a short delay for better UX
            setTimeout(() => {
                toast.dismiss(processingToast);
                toast.success('Booking confirmed successfully!', { duration: 4000 });
                navigate('/my-bookings');
            }, 800);
        } catch (err: any) {
            toast.dismiss(processingToast);
            toast.error(err.response?.data?.msg || 'Booking failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-4xl inline-block"
                    >
                        🎟️
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Book Your Ticket
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Start your journey with us today.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="bookingType" className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                            <select
                                name="bookingType"
                                id="bookingType"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={form.bookingType}
                                onChange={handleChange}
                            >
                                <option value="railway">Railway</option>
                                <option value="metro">Metro</option>
                                <option value="event">Event</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="journeyDate" className="block text-sm font-medium text-gray-700 mb-1">Journey Date</label>
                            <input
                                id="journeyDate"
                                name="journeyDate"
                                type="date"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={form.journeyDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">Passenger Name</label>
                            <input
                                id="passengerName"
                                name="passengerName"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={form.passengerName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="panOrAadhaar" className="block text-sm font-medium text-gray-700 mb-1">PAN / Aadhaar Number</label>
                            <input
                                id="panOrAadhaar"
                                name="panOrAadhaar"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="ABCD1234E"
                                value={form.panOrAadhaar}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
