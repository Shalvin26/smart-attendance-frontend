import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const AttendanceGrid = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const scheduleRes = await API.get(`/schedule/${subjectId}`);
    
    // Include both upcoming AND rescheduled lectures
    const availableSchedules = scheduleRes.data.schedules.filter(
      s => s.status === 'upcoming' || s.status === 'rescheduled'
    );
    setSchedules(availableSchedules);

    const subjectRes = await API.get(`/subjects/${subjectId}`);
    setStudents(subjectRes.data.subject.students);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleTap = (studentId) => {
    setAttendance(prev => {
      const current = prev[studentId];
      if (!current) return { ...prev, [studentId]: 'present' };
      if (current === 'present') return { ...prev, [studentId]: 'absent' };
      if (current === 'absent') {
        const updated = { ...prev };
        delete updated[studentId];
        return updated;
      }
    });
  };

  const getButtonStyle = (studentId) => {
    const status = attendance[studentId];
    if (status === 'present') return 'bg-green-500 border-green-600 text-white';
    if (status === 'absent') return 'bg-red-500 border-red-600 text-white';
    return 'bg-gray-100 border-gray-300 text-gray-700';
  };

  const getStatusLabel = (studentId) => {
    const status = attendance[studentId];
    if (status === 'present') return 'Present';
    if (status === 'absent') return 'Absent';
    return 'Not Marked';
  };

  const handleSubmit = async () => {
    if (!selectedSchedule) {
      alert('Please select a lecture first');
      return;
    }

    if (students.length === 0) {
      alert('No students enrolled in this subject');
      return;
    }

    setSubmitting(true);

    try {
      const attendanceArray = students.map(student => ({
        studentId: student._id,
        rollNumber: student.rollNumber,
        status: attendance[student._id] || 'absent'
      }));

      await API.post('/attendance', {
        scheduleId: selectedSchedule,
        attendance: attendanceArray
      });

      alert('Attendance submitted successfully!');
      navigate('/teacher/dashboard');

    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
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

      <div className="max-w-5xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Take Attendance
        </h2>

        {/* Select Lecture Date */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Lecture Date
          </label>
          <select
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a lecture --</option>
            {schedules.map(s => (
              <option key={s._id} value={s._id}>
                Lecture {s.lectureNumber} — {new Date(s.date).toDateString()} ({s.dayOfWeek})
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <span className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 inline-block"></span>
            Not Marked
          </span>
          <span className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-green-500 inline-block"></span>
            Present
          </span>
          <span className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 rounded bg-red-500 inline-block"></span>
            Absent
          </span>
          <span className="text-xs text-gray-400 ml-2">
            Tap once = Present · Tap twice = Absent · Tap again = Reset
          </span>
        </div>

        {/* Attendance Grid */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Students ({students.length})
          </h3>

          {students.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No students enrolled yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {students.map(student => (
                <button
                  key={student._id}
                  onClick={() => handleTap(student._id)}
                  className={`border-2 rounded-xl p-3 transition duration-150 text-left w-full ${getButtonStyle(student._id)}`}
                >
                  {/* Roll Number */}
                  <p className="text-xs font-bold tracking-wide break-all leading-tight mb-1">
                    {student.rollNumber}
                  </p>

                  {/* Name */}
                  <p className="text-xs font-normal truncate opacity-80">
                    {student.name}
                  </p>

                  {/* Status Badge */}
                  <p className="text-xs font-semibold mt-2 opacity-90">
                    {getStatusLabel(student._id)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {students.length}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {Object.values(attendance).filter(s => s === 'present').length}
              </p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {Object.values(attendance).filter(s => s === 'absent').length}
              </p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">
                {students.length - Object.keys(attendance).length}
              </p>
              <p className="text-xs text-gray-500">Not Marked</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Attendance'}
        </button>

      </div>
    </div>
  );
};

export default AttendanceGrid;