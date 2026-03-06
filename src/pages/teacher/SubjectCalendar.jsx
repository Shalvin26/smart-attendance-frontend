import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const SubjectCalendar = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const scheduleRes = await API.get(`/schedule/${subjectId}`);
      const subjectRes = await API.get(`/subjects/${subjectId}`);

      setSubjectName(subjectRes.data.subject.name);

      const calendarEvents = scheduleRes.data.schedules.map(s => ({
        id: s._id,
        title: `L${s.lectureNumber} - ${s.status}`,
        date: s.date.split('T')[0],
        backgroundColor: getColor(s.status),
        borderColor: getColor(s.status),
        textColor: '#ffffff',
        extendedProps: {
          status: s.status
        }
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (status) => {
    if (status === 'conducted') return '#27AE60';
    if (status === 'cancelled') return '#C73E1D';
    if (status === 'rescheduled') return '#2E86AB';
    if (status === 'upcoming') return '#F39C12';
    return '#F39C12';
  };

  const handleCancel = async (scheduleId) => {
    const confirmed = window.confirm('Cancel this lecture?');
    if (!confirmed) return;

    try {
      await API.patch(`/schedule/${scheduleId}/cancel`);
      alert('Lecture cancelled!');
      fetchSchedule();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleReschedule = async (scheduleId) => {
  const input = window.prompt('Enter new date (DD-MM-YYYY):');
  if (!input) return;

  // Convert DD-MM-YYYY to YYYY-MM-DD for backend
  const parts = input.split('-');
  if (parts.length !== 3) {
    alert('Invalid date format. Please use DD-MM-YYYY');
    return;
  }

  const [day, month, year] = parts;
  const newDate = `${year}-${month}-${day}`;

  // Validate date
  const dateObj = new Date(newDate);
  if (isNaN(dateObj.getTime())) {
    alert('Invalid date. Please use DD-MM-YYYY');
    return;
  }

  try {
    await API.patch(`/schedule/${scheduleId}/reschedule`, { newDate });
    alert('Lecture rescheduled successfully!');
    fetchSchedule();
  } catch (err) {
    alert(err.response?.data?.error || 'Something went wrong');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
       

        <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {subjectName} — Schedule Calendar
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Click on any upcoming or rescheduled lecture to cancel or reschedule it
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {events.length}
            </p>
            <p className="text-sm text-gray-500">Total Lectures</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {events.filter(e => e.extendedProps.status === 'conducted').length}
            </p>
            <p className="text-sm text-gray-500">Conducted</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {events.filter(e => e.extendedProps.status === 'upcoming').length}
            </p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 flex-wrap">
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#F39C12' }}></span>
            Upcoming
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#27AE60' }}></span>
            Conducted
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#C73E1D' }}></span>
            Cancelled
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: '#2E86AB' }}></span>
            Rescheduled
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
            eventClick={(info) => {
              const scheduleId = info.event.id;
              const status = info.event.extendedProps.status;

              if (status === 'conducted') {
                alert('This lecture is already conducted and cannot be changed');
                return;
              }

              if (status === 'cancelled') {
                alert('This lecture is already cancelled');
                return;
              }

              const action = window.confirm(
                'Click OK to Cancel this lecture\nClick Cancel to Reschedule it'
              );

              if (action) {
                handleCancel(scheduleId);
              } else {
                handleReschedule(scheduleId);
              }
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default SubjectCalendar;