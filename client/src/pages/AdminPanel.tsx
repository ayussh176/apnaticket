import { useEffect, useState, useMemo } from 'react';
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
    ip?: string;
    amount?: number; // Optional if we track amount
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
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState<'bookings' | 'logs'>('bookings');

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
                if (error.response && error.response.status === 403) {
                    toast.error('Access Denied. Admins Only.');
                } else {
                    toast.error('Failed to fetch admin data');
                }
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleCancel = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/book/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Booking cancelled by Admin');
            // Refresh data
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        } catch (error) {
            toast.error('Failed to cancel booking');
            console.error(error);
        }
    };

    // Analytics & Filtering
    const filteredBookings = useMemo(() => {
        if (filterType === 'all') return bookings;
        return bookings.filter(b => b.bookingType === filterType);
    }, [bookings, filterType]);

    const stats = useMemo(() => {
        const totalBookings = bookings.length;
        const totalConfirmed = bookings.filter(b => b.status === 'confirmed').length;
        const totalCancelled = bookings.filter(b => b.status === 'cancelled').length;
        // Assuming flat rate 50 for now, or use b.amount if available
        const totalRevenue = totalConfirmed * 50;

        // Top Users
        const userCounts: Record<string, number> = {};
        bookings.forEach(b => {
            userCounts[b.userEmail] = (userCounts[b.userEmail] || 0) + 1;
        });
        const topUsers = Object.entries(userCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        return { totalBookings, totalConfirmed, totalCancelled, totalRevenue, topUsers };
    }, [bookings]);

    const exportCSV = () => {
        const headers = ["User Email", "Passenger", "Type", "Date", "Status", "Created At", "IP"];
        const rows = bookings.map(b => [
            b.userEmail,
            b.passengerName,
            b.bookingType,
            new Date(b.journeyDate).toLocaleDateString(),
            b.status,
            new Date(b.createdAt).toLocaleString(),
            b.ip || 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bookings_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-center mt-20 text-xl font-semibold text-gray-600">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
                    <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition">
                        📥 Export CSV
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'bookings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Booking Management
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'logs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Audit Trail
                    </button>
                </div>

                {activeTab === 'bookings' ? (
                    <>
                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-sm font-medium text-gray-500 uppercase">Total Revenue</h2>
                                <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalRevenue}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-sm font-medium text-gray-500 uppercase">Total Bookings</h2>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBookings}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-sm font-medium text-gray-500 uppercase">Cancelled</h2>
                                <p className="text-3xl font-bold text-red-600 mt-2">{stats.totalCancelled}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-sm font-medium text-gray-500 uppercase">Top User</h2>
                                <p className="text-lg font-bold text-gray-800 mt-2 truncate">
                                    {stats.topUsers[0] ? `${stats.topUsers[0][0]} (${stats.topUsers[0][1]})` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex items-center space-x-4">
                            <span className="font-medium text-gray-700">Filter by Type:</span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="border-gray-300 border rounded-md shadow-sm px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Types</option>
                                <option value="railway">Railway</option>
                                <option value="metro">Metro</option>
                                <option value="event">Event</option>
                            </select>
                        </div>

                        {/* Bookings Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">IP Address</th>
                                            <th className="px-6 py-3">Created At</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className={booking.status === 'cancelled' ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.userEmail}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{booking.bookingType}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.journeyDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                        }`}>
                                                        {booking.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{booking.ip || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.createdAt).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="text-red-600 hover:text-red-900 font-medium hover:underline"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredBookings.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No bookings found matching filter.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Logs Table (Audit Trail) */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-800">System Audit Trail</h2>
                        </div>
                        <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Timestamp</th>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Meta Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {logs.slice().reverse().map((log, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{log.user}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{log.action}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <pre className="text-xs bg-gray-100 p-2 rounded max-w-xs overflow-x-auto">
                                                    {JSON.stringify(log.metadata, null, 2)}
                                                </pre>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
