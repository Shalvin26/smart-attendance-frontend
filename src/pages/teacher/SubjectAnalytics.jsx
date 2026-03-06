import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

const SubjectAnalytics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [totalLectures, setTotalLectures] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(`/attendance/all-students/${subjectId}`);
      setAnalytics(res.data.analytics);
      setTotalLectures(res.data.totalLectures);

      const subjectRes = await API.get(`/subjects/${subjectId}`);
      setSubjectName(subjectRes.data.subject.name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 75) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadge = (status) => {
    if (status.includes('Safe')) {
      return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold';
    }
    return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold';
  };

  const filteredAnalytics = analytics.filter(item =>
    item.student.name.toLowerCase().includes(search.toLowerCase()) ||
    item.student.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {subjectName} — Student Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Conducted Lectures: <strong>{totalLectures}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="text-gray-600 text-sm hover:text-blue-600"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {analytics.length}
            </p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {analytics.filter(a => parseFloat(a.percentage) >= 75).length}
            </p>
            <p className="text-sm text-gray-500">Safe (≥75%)</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">
              {analytics.filter(a => parseFloat(a.percentage) < 75).length}
            </p>
            <p className="text-sm text-gray-500">Shortage (&lt;75%)</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Roll No
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Attended
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Percentage
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Classes Needed
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalytics.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredAnalytics.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.student.rollNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {item.student.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.student.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {item.attended}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {item.totalLectures}
                    </td>
                    <td className={`px-6 py-4 text-center font-bold text-sm ${getPercentageColor(item.percentage)}`}>
                      {item.percentage}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={getBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {item.classesNeeded > 0 ? (
                        <span className="text-red-500 font-semibold">
                          {item.classesNeeded} more
                        </span>
                      ) : (
                        <span className="text-green-500 font-semibold">
                          Can skip {item.canSkip}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SubjectAnalytics;