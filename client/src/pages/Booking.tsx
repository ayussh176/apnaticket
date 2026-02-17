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
        role: 'major', // 'major' or 'minor'
        guardianPan: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'minor' : 'major') : value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const processingToast = toast.loading('Verifying ID and checking wallet...');

        try {
            await axios.post('http://localhost:5000/api/book', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTimeout(() => {
                toast.dismiss(processingToast);
                toast.success('Booking confirmed! ₹50 deducted.', { duration: 4000 });
                navigate('/mybookings');
            }, 800);
        } catch (err: any) {
            toast.dismiss(processingToast);
            let errorMsg = 'Booking failed. Please try again.';

            if (err.response) {
                if (err.response.status === 402) {
                    errorMsg = '❌ Insufficient wallet balance! Please recharge.';
                } else if (err.response.status === 429) {
                    errorMsg = '🚫 Booking limit reached (2 per user).';
                } else {
                    errorMsg = err.response.data?.msg || errorMsg;
                }
            }

            toast.error(errorMsg);
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
                        ₹50 will be deducted from your wallet.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
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
                        <div>
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
                        <div>
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

                        <div className="flex items-center">
                            <input
                                id="role"
                                name="role"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={form.role === 'minor'}
                                onChange={handleChange}
                            />
                            <label htmlFor="role" className="ml-2 block text-sm text-gray-900">
                                I am under 18 (Minor)
                            </label>
                        </div>

                        <div>
                            <label htmlFor="panOrAadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                                {form.role === 'minor' ? 'Aadhaar Number (12 digits)' : 'PAN Number (10 chars)'}
                            </label>
                            <input
                                id="panOrAadhaar"
                                name="panOrAadhaar"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder={form.role === 'minor' ? '123456789012' : 'ABCDE1234F'}
                                value={form.panOrAadhaar}
                                onChange={handleChange}
                            />
                        </div>

                        {form.role === 'minor' && (
                            <div>
                                <label htmlFor="guardianPan" className="block text-sm font-medium text-gray-700 mb-1">Guardian PAN</label>
                                <input
                                    id="guardianPan"
                                    name="guardianPan"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Guardian's PAN"
                                    value={form.guardianPan}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

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
