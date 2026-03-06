import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateSubject from './pages/teacher/CreateSubject';
import AttendanceGrid from './pages/teacher/AttendanceGrid';
import StudentDashboard from './pages/student/StudentDashboard';
import AddStudent from './pages/teacher/AddStudent';
import SubjectCalendar from './pages/teacher/SubjectCalendar';
import StudentCalendar from './pages/student/StudentCalendar';
import SubjectAnalytics from './pages/teacher/SubjectAnalytics';
import EditSubject from './pages/teacher/EditSubject';



const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/create-subject" element={
            <ProtectedRoute role="teacher">
              <CreateSubject />
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance/:subjectId" element={
          <ProtectedRoute role="teacher">
          <AttendanceGrid />
          </ProtectedRoute>
          } />
          <Route path="/teacher/add-student/:subjectId" element={
          <ProtectedRoute role="teacher">
          <AddStudent />
          </ProtectedRoute>
          } />

          <Route path="/teacher/calendar/:subjectId" element={
          <ProtectedRoute role="teacher">
            <SubjectCalendar />
          </ProtectedRoute>
          } />

          <Route path="/teacher/analytics/:subjectId" element={
          <ProtectedRoute role="teacher">
            <SubjectAnalytics />
          </ProtectedRoute>
        } />

          <Route path="/teacher/edit-subject/:subjectId" element={
          <ProtectedRoute role="teacher">
            <EditSubject />
          </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/calendar/:subjectId" element={
          <ProtectedRoute role="student">
          <StudentCalendar />
          </ProtectedRoute>
        } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
