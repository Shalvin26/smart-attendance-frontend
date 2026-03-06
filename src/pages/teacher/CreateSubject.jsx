import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const CreateSubject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semesterStart: '',
    semesterEnd: '',
    lectureDays: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/subjects', formData);
      alert('Subject created successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

     

      <Navbar />
      {/* Form */}
      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Subject
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mathematics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MATH101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester Start Date
              </label>
              <input
                type="date"
                name="semesterStart"
                value={formData.semesterStart}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester End Date
              </label>
              <input
                type="date"
                name="semesterEnd"
                value={formData.semesterEnd}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lecture Days
              </label>
              <input
                type="text"
                name="lectureDays"
                value={formData.lectureDays}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Monday Wednesday Friday"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter days separated by space or comma
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Subject'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubject;