import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';




const StudentCalendar = () => {
  const { user } = useAuth();
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const scheduleRes = await API.get(`/schedule/${subjectId}`);
    const subjectRes = await API.get(`/subjects/${subjectId}`);
    setSubjectName(subjectRes.data.subject.name);

    const analyticsRes = await API.get(`/attendance/analytics/${subjectId}`);
    setAnalytics(analyticsRes.data);

    const attendanceRes = await API.get(`/attendance/subject/${subjectId}`);
    const attendanceRecords = attendanceRes.data.records;

    const calendarEvents = scheduleRes.data.schedules.map(s => {
      let color = '#F39C12'; // yellow — upcoming
      let title = `L${s.lectureNumber}`;

      if (s.status === 'conducted') {
        // Find attendance record matching this schedule
        const record = attendanceRecords.find(
          r => r.scheduleId.toString() === s._id.toString()
        );

        if (record) {
          // Find this student's entry by rollNumber
          const entry = record.attendance.find(
            a => a.rollNumber === user.rollNumber
          );

          if (entry?.status === 'present') {
            color = '#27AE60'; // green — present
            title = `L${s.lectureNumber} ✓`;
          } else {
            color = '#C73E1D'; // red — absent
            title = `L${s.lectureNumber} ✗`;
          }
        }
      }

      return {
        id: s._id,
        title,
        date: s.date.split('T')[0],
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
      };
    });

    setEvents(calendarEvents);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
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

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {subjectName} — My Attendance Calendar
        </h2>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {analytics.totalLectures}
              </p>
              <p className="text-xs text-gray-500">Total Lectures</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {analytics.attended}
              </p>
              <p className="text-xs text-gray-500">Attended</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <p className={`text-2xl font-bold ${parseFloat(analytics.percentage) >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                {analytics.percentage}
              </p>
              <p className="text-xs text-gray-500">Percentage</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">
                {analytics.status}
              </p>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>
        )}
                  {/* Upcoming Lectures Info */}
<div className="bg-white rounded-2xl shadow p-6 mb-6">
  <h3 className="font-bold text-gray-800 mb-4">Lecture Summary</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-yellow-500">
        {events.filter(e => e.backgroundColor === '#F39C12').length}
      </p>
      <p className="text-xs text-gray-500 mt-1">Upcoming Lectures</p>
    </div>
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-green-500">
        {events.filter(e => e.backgroundColor === '#27AE60').length}
      </p>
      <p className="text-xs text-gray-500 mt-1">Present</p>
    </div>
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-red-500">
        {events.filter(e => e.backgroundColor === '#C73E1D').length}
      </p>
      <p className="text-xs text-gray-500 mt-1">Absent</p>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-blue-500">
        {events.length}
      </p>
      <p className="text-xs text-gray-500 mt-1">Total Lectures</p>
    </div>
  </div>

      {/* Upcoming lectures list */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Remaining Lectures ({events.filter(e => e.backgroundColor === '#F39C12').length})
        </h4>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {events
            .filter(e => e.backgroundColor === '#F39C12')
            .map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-2"
              >
                <span className="text-sm font-medium text-gray-700">
                  {event.title}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(event.date).toDateString()}
                </span>
              </div>
            ))}
          {events.filter(e => e.backgroundColor === '#F39C12').length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">
              No upcoming lectures remaining
            </p>
          )}
        </div>
      </div>
    </div>
        {/* Shortage or Safe Alert */}
        {analytics && analytics.classesNeeded > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 font-semibold">⚠️ Shortage Alert!</p>
            <p className="text-red-500 text-sm mt-1">
              Attend next <strong>{analytics.classesNeeded} classes</strong> consecutively to reach 75%
            </p>
          </div>
        )}

        {analytics && analytics.canSkip > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <p className="text-green-600 font-semibold">✅ You are safe!</p>
            <p className="text-green-500 text-sm mt-1">
              You can skip up to <strong>{analytics.canSkip} more classes</strong> and still maintain 75%
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-6 mb-6 flex-wrap">
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#27AE60' }}></span>
            Present
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#C73E1D' }}></span>
            Absent
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#F39C12' }}></span>
            Upcoming
          </span>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow p-6">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
            eventDisplay="block"
            displayEventTime={false}
          />
        </div>

      </div>
    </div>
  );
};

export default StudentCalendar;