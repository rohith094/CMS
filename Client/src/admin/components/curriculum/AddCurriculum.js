import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AddCurriculum = () => {
  const { branchcode: paramBranchCode } = useParams();
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [coursecode, setCoursecode] = useState('');
  const [semesternumber, setSemesternumber] = useState('');
  const [coursetype, setCoursetype] = useState('');
  const [loading, setLoading] = useState(false);
  const [branchcode, setBranchcode] = useState(paramBranchCode);
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering courses

  const token = Cookies.get('admintoken');

  // Fetch Active Semesters
  useEffect(() => {
    const fetchActiveSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/activesemesters', {
          headers: { Authorization: `${token}` },
        });
        setSemesters(response.data);
        setSemesternumber(response.data[0]?.semesternumber || '');
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    fetchActiveSemesters();
  }, [token]);

  // Fetch Courses by branchcode
  useEffect(() => {
    const fetchCoursesByBranchCode = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/courses/${branchcode}`, {
          headers: { Authorization: `${token}` },
        });
        setCourses(response.data);  // Set fetched courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCoursesByBranchCode();
  }, [branchcode, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:3001/admin/addcurriculum', {
        coursecode,
        branchcode,
        semesternumber,
        coursetype,
      }, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Curriculum added successfully");
      navigate(`/admin/curriculum/${branchcode}`);
      setCoursecode('');
      setCoursetype('');
      setSemesternumber(semesters[0]?.semesternumber || '');
    } catch (error) {
      console.error('Error adding curriculum:', error);
      toast.error("Error adding course....");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Curriculum</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Code:</label>
          <input
            type="text"
            value={branchcode}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select or Search Course Code:</label>
          <input
            list="coursecodes" // Uses datalist for searching within the select-like dropdown
            value={coursecode}
            onChange={(e) => setCoursecode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Search or select course code"
            required
          />
          <datalist id="coursecodes">
            {courses.map((course) => (
              <option key={course.coursecode} value={course.coursecode}>
                {course.coursecode}
              </option>
            ))}
          </datalist>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Semester:</label>
          <select
            value={semesternumber}
            onChange={(e) => setSemesternumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            {semesters.map((semester) => (
              <option key={semester.semesternumber} value={semester.semesternumber}>
                {semester.semestername}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course Type:</label>
          <select
            value={coursetype}
            onChange={(e) => setCoursetype(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Course Type</option>
            <option value="mandatory">Mandatory</option>
            <option value="professional">Professional</option>
            <option value="elective">Elective</option>
          </select>
        </div>

        <button
          style={{backgroundColor : "#1A2438"}}
          type="submit"
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ${loading ? 'opacity-50' : ''}`}
          disabled={loading} 
        >
          {loading ? 'Adding...' : 'Add Curriculum'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full mt-2 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-gray-400"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default AddCurriculum;
