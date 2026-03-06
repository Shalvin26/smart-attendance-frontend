import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    rollNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      navigate('/login');
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
            Get started in minutes.
          </h2>
          <p className="text-blue-200 text-lg">
            Create your account, set up your subjects, and start taking attendance from day one.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {[
            { step: '01', text: 'Create your teacher account' },
            { step: '02', text: 'Set up subjects and semester dates' },
            { step: '03', text: 'Start taking attendance instantly' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-blue-500 bg-opacity-50 rounded-xl px-4 py-3 flex items-center gap-4"
            >
              <span className="text-blue-200 font-bold text-lg">{item.step}</span>
              <p className="text-white text-sm font-medium">{item.text}</p>
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
              Create account
            </h2>
            <p className="text-gray-500 mt-1">
              Fill in the details below to get started
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
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

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

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I am a
              </label>
              <div className="flex gap-3">
                {['teacher', 'student'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition duration-200 capitalize ${
                      formData.role === r
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {r === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Number — only for students */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  placeholder="24BME000"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            )}

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
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>

          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Register;