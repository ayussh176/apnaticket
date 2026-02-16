import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <span className="text-2xl font-extrabold tracking-tight">ApnaTicket</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/dashboard"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/book"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive('/book') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
                        >
                            Book Ticket
                        </Link>
                        <Link
                            to="/my-bookings"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive('/my-bookings') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
                        >
                            My Bookings
                        </Link>
                        {/* Admin Link Mock - in real app, check context/user */}
                        {localStorage.getItem('token') && (
                            // Ideally, decode token to check email, but for now simple link.
                            // Better: Navbar should receive user prop or use context.
                            // I'll leave it simple for now or fetch user?
                            // Navbar doesn't fetch user. Let's just add the link and rely on page access control.
                            <Link
                                to="/admin"
                                className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
                            >
                                Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav >
    );
}
