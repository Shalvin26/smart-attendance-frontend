import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard' },
  ];

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <div
        onClick={() => navigate(user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')}
        className="cursor-pointer"
      >
        <h1 className="text-xl font-bold text-blue-600">
          Smart Attendance
        </h1>
        <p className="text-xs text-gray-400">
          {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
        </p>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`text-sm font-medium transition duration-200 ${
              location.pathname === link.path
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* User Info + Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;