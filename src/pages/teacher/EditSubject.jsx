import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

const EditSubject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semesterStart: '',
    semesterEnd: '',
    lectureDays: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubject();
  }, []);

  const fetchSubject = async () => {
    try {
      const res = await API.get(`/subjects/${subjectId}`);
      const subject = res.data.subject;

      setFormData({
        name: subject.name,
        code: subject.code,
        semesterStart: subject.semesterStart.split('T')[0],
        semesterEnd: subject.semesterEnd.split('T')[0],
        lectureDays: subject.lectureDays.join(', ')
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await API.put(`/subjects/${subjectId}`, formData);
      alert('Subject updated successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Subject
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter days separated by space or comma
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubject;