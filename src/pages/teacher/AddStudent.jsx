import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';


const AddStudent = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get all students
      const allRes = await API.get('/users/students');
      setStudents(allRes.data.students);

      // Get enrolled students for this subject
      const subjectRes = await API.get(`/subjects/${subjectId}`);
      setEnrolled(subjectRes.data.subject.students.map(s => s._id));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentId) => {
    setAdding(studentId);
    try {
      await API.post(`/subjects/${subjectId}/add-student`, { studentId });
      setEnrolled(prev => [...prev, studentId]);
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    } finally {
      setAdding(null);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="max-w-2xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Students to Subject
        </h2>

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

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No students found
            </p>
          ) : (
            filteredStudents.map(student => (
              <div
                key={student._id}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    Roll No: {student.rollNumber} · {student.email}
                  </p>
                </div>

                {enrolled.includes(student._id) ? (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Enrolled ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddStudent(student._id)}
                    disabled={adding === student._id}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {adding === student._id ? 'Adding...' : 'Add'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AddStudent;