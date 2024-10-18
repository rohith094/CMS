import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ViewCurriculum = () => {
  const { branchcode } = useParams();
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseTypes, setCourseTypes] = useState([]); // State to store unique coursetypes
  const token = Cookies.get('admintoken');
  const navigate = useNavigate();

  // Fetch active semesters
  useEffect(() => {
    const fetchActiveSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/activesemesters', {
          headers: { Authorization: `${token}` },
        });

        const formattedSemesters = response.data.map(semester => ({
          ...semester,
          startdate: new Date(semester.startdate).toISOString().split('T')[0],
          enddate: new Date(semester.enddate).toISOString().split('T')[0],
        }));

        setSemesters(formattedSemesters);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    fetchActiveSemesters();
  }, [token]);

  // Fetch curriculum data and unique coursetypes based on selected semester
  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!selectedSemester) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/admin/viewcurriculum/${branchcode}/${selectedSemester}`, {
          headers: { Authorization: `${token}` },
        });

        // Extract unique coursetypes and trim them to remove any leading/trailing spaces
        const uniqueCourseTypes = [...new Set(response.data.map(course => course.coursetype.trim()))];
        setCourseTypes(uniqueCourseTypes);
        setCurriculum(response.data);
      } catch (error) {
        console.error('Error fetching curriculum:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [branchcode, selectedSemester, token]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setCurriculum([]); // Clear previous curriculum data
    setCourseTypes([]); // Clear previous coursetype data
  };

  const EditCurriculum = (curriculumid) => {
    navigate(`editcurriculum/${curriculumid}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Curriculum Management</h1>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <label htmlFor="semesternumber" className="block mb-2 text-lg font-medium">Select Semester:</label>
          <select
            id="semesternumber"
            value={selectedSemester}
            onChange={handleSemesterChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a Semester</option> {/* Placeholder option */}
            {semesters.map((semester) => (
              <option key={semester.semesternumber} value={semester.semesternumber}>
                {`${semester.semestername} - ${semester.startdate} to ${semester.enddate}`}
              </option>
            ))}
          </select>
        </div>

        {/* Add Curriculum Button */}
        <button
          className="text-white font-bold py-2 px-4 rounded-lg shadow-sm"
          style={{ backgroundColor: "#1A2438", cursor: "pointer" }}
          onClick={() => navigate('addcurriculum')}
        >
          Add Curriculum
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <div>
          {curriculum.length > 0 ? (
            <div>
              {/* Iterate over unique course types */}
              {courseTypes.map((type) => (
                <div key={type}>
                  <h2 className="text-2xl font-bold mb-4 mt-6">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Filter courses by coursetype and display them */}
                    {curriculum
                      .filter(course => course.coursetype.trim() === type)
                      .map(course => (
                        <div key={course.curriculumid} className="bg-white p-4 shadow-md rounded-lg">
                          <p className="font-semibold">Course Code: {course.coursecode}</p>
                          <p>Course Name: {course.coursename}</p>
                          <p>Credits: {course.credits}</p>
                          <div className="flex justify-between mt-2">
                            <button
                              style={{ backgroundColor: "#1A2438", cursor: "pointer" }}
                              className="bg-blue-500 text-white font-bold py-1 px-3 rounded-lg shadow-sm transition duration-300"
                              onClick={() => EditCurriculum(course.curriculumid)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg shadow-sm transition duration-300"
                              onClick={() => { /* Delete function */ }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedSemester && !loading ? (
            <p className="text-center text-red-500 font-medium">No curriculum found for the selected semester.</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ViewCurriculum;
