import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/attendance/analytics');
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 75) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressBarColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 75) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressBg = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 75) return 'bg-green-50';
    if (value >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  // Overall attendance across all subjects
  const overallAttended = analytics.reduce((sum, item) => sum + item.attended, 0);
  const overallTotal = analytics.reduce((sum, item) => sum + item.totalLectures, 0);
  const overallPercentage = overallTotal === 0 ? 0 : ((overallAttended / overallTotal) * 100).toFixed(1);
  const subjectsAtRisk = analytics.filter(a => parseFloat(a.percentage) < 75).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            My Attendance
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Roll Number: <span className="font-semibold text-gray-700">{user?.rollNumber}</span>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-gray-500 text-sm">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* Not enrolled */}
        {!loading && analytics.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Not enrolled in any subject
            </h3>
            <p className="text-gray-400 text-sm">
              Contact your teacher to get enrolled in subjects
            </p>
          </div>
        )}

        {/* Overall Summary Cards */}
        {!loading && analytics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {analytics.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Subjects</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className={`text-2xl font-bold ${parseFloat(overallPercentage) >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                {overallPercentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Overall Attendance</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {analytics.length - subjectsAtRisk}
              </p>
              <p className="text-xs text-gray-500 mt-1">Subjects Safe</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-500">
                {subjectsAtRisk}
              </p>
              <p className="text-xs text-gray-500 mt-1">At Risk</p>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200"
            >

              {/* Subject Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg mb-2">
                    {item.subject.code}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.subject.name}
                  </h3>
                </div>
                <div className={`text-2xl font-bold ${getPercentageColor(item.percentage)}`}>
                  {item.percentage}
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`w-full rounded-full h-2.5 mb-4 ${getProgressBg(item.percentage)}`}>
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${getProgressBarColor(item.percentage)}`}
                  style={{ width: `${Math.min(parseFloat(item.percentage), 100)}%` }}
                />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{item.attended}</p>
                  <p className="text-xs text-gray-400">Attended</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">{item.totalLectures}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-800">
                    {item.totalLectures - item.attended}
                  </p>
                  <p className="text-xs text-gray-400">Missed</p>
                </div>
              </div>

              {/* Shortage Alert */}
              {item.classesNeeded > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>⚠️</span>
                    <p className="text-red-600 text-sm font-semibold">
                      Shortage Alert!
                    </p>
                  </div>
                  <p className="text-red-500 text-xs">
                    Attend next <strong>{item.classesNeeded} classes</strong> consecutively to reach 75%
                  </p>
                </div>
              )}

              {/* Safe Alert */}
              {item.canSkip > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>✅</span>
                    <p className="text-green-600 text-sm font-semibold">
                      You are safe!
                    </p>
                  </div>
                  <p className="text-green-500 text-xs">
                    You can skip up to <strong>{item.canSkip} more classes</strong> and still maintain 75%
                  </p>
                </div>
              )}

              {/* View Calendar Button */}
              <button
                onClick={() => navigate(`/student/calendar/${item.subject.id}`)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition duration-200"
              >
                View My Calendar →
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;