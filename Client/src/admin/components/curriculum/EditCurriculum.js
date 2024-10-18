import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const EditCurriculum = () => {
  const { branchcode, curriculumid } = useParams(); // Get both branchcode and curriculumid from the URL params
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [coursecode, setCoursecode] = useState('');
  const [semesternumber, setSemesternumber] = useState('');
  const [coursetype, setCoursetype] = useState('');
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('admintoken');

  // Fetch all semesters
  useEffect(() => {
    const fetchAllSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/allsemesters', {
          headers: { Authorization: `${token}` },
        });
        setSemesters(response.data);
      } catch (error) {
        console.error('Error fetching all semesters:', error);
      }
    };

    fetchAllSemesters();
  }, [token]);

  // Fetch curriculum details by curriculumid
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/curriculum/${curriculumid}`, {
          headers: { Authorization: `${token}` },
        });

        const curriculumData = response.data;
        if (curriculumData) {
          setCoursecode(curriculumData.coursecode);
          setSemesternumber(curriculumData.semesternumber);
          setCoursetype(curriculumData.coursetype);
        }
      } catch (error) {
        console.error('Error fetching curriculum:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [curriculumid, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:3001/admin/updatecurriculum/${curriculumid}`, {
        coursecode,
        branchcode, // Include branchcode in the update
        semesternumber,
        coursetype,
      }, {
        headers: { Authorization: `${token}` },
      });
      toast.success("curriculum updated succesfully");
      navigate(-1); // Navigate back after successful update
    } catch (error) {
      console.error('Error updating curriculum:', error);
      toast.error("failed to update curriculum ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Curriculum</h1>
        {loading ? (
          <div className="loader text-center text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Branch Code Field (Disabled) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Branch Code:</label>
              <input
                type="text"
                value={branchcode}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                disabled // Disable the branchcode input
              />
            </div>

            {/* Course Code Field (Disabled) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Course Code:</label>
              <input
                type="text"
                value={coursecode}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                disabled // Disable the coursecode input
              />
            </div>

            {/* Semester Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Select Semester:</label>
              <select
                value={semesternumber}
                onChange={(e) => setSemesternumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
                disabled
              >
                {semesters.map((semester) => (
                  <option key={semester.semesternumber} value={semester.semesternumber}>
                    {semester.semestername}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Type Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Course Type:</label>
              <input
                type="text"
                placeholder="Course Type"
                value={coursetype}
                onChange={(e) => setCoursetype(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Curriculum'}
            </button>
          </form>
        )}
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditCurriculum;
