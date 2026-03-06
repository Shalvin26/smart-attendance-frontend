import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects');
      setSubjects(res.data.subjects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async (subjectId) => {
    try {
      const res = await API.post(`/schedule/generate/${subjectId}`);
      alert(`Schedule generated! Total lectures: ${res.data.totalLectures}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    const confirm = window.confirm('Are you sure? This will delete the subject, all schedules and attendance permanently.');
    if (!confirm) return;

    try {
      await API.delete(`/subjects/${subjectId}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              My Subjects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''} this semester
            </p>
          </div>
          <button
            onClick={() => navigate('/teacher/create-subject')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition duration-200 shadow-sm hover:shadow-md"
          >
            + Create Subject
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-gray-500 text-sm">Loading subjects...</p>
            </div>
          </div>
        )}

        {/* No subjects */}
        {!loading && subjects.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No subjects yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Create your first subject to get started
            </p>
            <button
              onClick={() => navigate('/teacher/create-subject')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition duration-200"
            >
              + Create Subject
            </button>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(subject => (
            <div
              key={subject._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200"
            >

              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  {/* Subject Code Badge */}
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg mb-2">
                    {subject.code}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      📅 {subject.lectureDays.join(', ')}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      👥 {subject.students.length} students
                    </span>
                  </div>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/teacher/edit-subject/${subject._id}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition duration-200"
                    title="Edit Subject"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition duration-200"
                    title="Delete Subject"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Semester Dates */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Start</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {new Date(subject.semesterStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-gray-300 text-sm">→</div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">End</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {new Date(subject.semesterEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Row 1 — 3 buttons */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => navigate(`/teacher/attendance/${subject._id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 transition duration-200"
                >
                  Take Attendance
                </button>
                <button
                  onClick={() => navigate(`/teacher/add-student/${subject._id}`)}
                  className="flex-1 bg-purple-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-purple-600 transition duration-200"
                >
                  Add Students
                </button>
                <button
                  onClick={() => handleGenerateSchedule(subject._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-green-600 transition duration-200"
                >
                  Generate Schedule
                </button>
              </div>

              {/* Row 2 — 2 buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/teacher/analytics/${subject._id}`)}
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-indigo-600 transition duration-200"
                >
                  View Analytics
                </button>
                <button
                  onClick={() => navigate(`/teacher/calendar/${subject._id}`)}
                  className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-amber-600 transition duration-200"
                >
                  View Calendar
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
