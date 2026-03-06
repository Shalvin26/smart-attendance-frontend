import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-3xl font-bold">
            Smart Attendance
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Academic Management System
          </p>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Manage attendance the smart way.
          </h2>
          <p className="text-blue-200 text-lg">
            Auto-generate schedules, take attendance in seconds, and track every student in real time.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-col gap-3">
          {[
            '⚡ Mark 40 students in under 60 seconds',
            '📅 Auto-generate full semester schedules',
            '📊 Real-time shortage predictions',
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-blue-500 bg-opacity-50 rounded-xl px-4 py-3"
            >
              <p className="text-white text-sm font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@gmail.com"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50 shadow-md hover:shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create one now
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;