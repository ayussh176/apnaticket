import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Booking {
    id: string;
    userEmail: string;
    bookingType: string;
    journeyDate: string;
    passengerName: string;
    status: string;
    createdAt: string;
}

interface Log {
    user: string;
    action: string;
    timestamp: string;
    metadata: any;
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const [bookingsRes, logsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/bookings', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/admin/logs', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setBookings(bookingsRes.data);
                setLogs(logsRes.data);
            } catch (error: any) {
                console.error(error);
                toast.error('Failed to fetch admin data');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    if (loading) return <div className="text-center mt-20">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Total Bookings</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Total Logs</h2>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{logs.length}</p>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Passenger</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4">{booking.userEmail}</td>
                                    <td className="px-6 py-4">{booking.passengerName}</td>
                                    <td className="px-6 py-4">{booking.bookingType}</td>
                                    <td className="px-6 py-4">{booking.journeyDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Audit Logs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.slice().reverse().map((log, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{log.user}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs bg-gray-100 p-2 rounded">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
