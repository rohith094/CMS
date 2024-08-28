import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaEdit } from 'react-icons/fa';

const CoursesList = () => {
  const { branchcode } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const token = Cookies.get('admintoken');
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (debouncedQuery) {
        setSearchLoading(true); // Set loading only for search operation
      } else {
        setLoading(true); // Set loading for initial data fetch
      }

      try {
        const response = await axios.get(`http://localhost:3001/admin/courses/${branchcode}`, {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            coursecode: debouncedQuery,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        if (debouncedQuery) {
          setSearchLoading(false); // Stop loading for search operation
        } else {
          setLoading(false); // Stop loading for initial data fetch
        }
      }
    };

    fetchCourses();
  }, [branchcode, debouncedQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }

  const handleEdit = (coursecode)=>{
    navigate(`/admin/branch/${branchcode}/editcourse/${coursecode}`);
  }

  return (
    <div style={{ width: '100%', height: '95vh' }} className="container py-2">
      <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>

      {/* Search Input */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by Course Code"
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div style={{ height: '80vh' }} className="downscroll overflow-x-auto">
        {searchLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <table style={{ width: '85vw' }} className="bg-white border border-gray-300">
            <thead className="sticky top-0 bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 border-b text-left font-semibold">Course Code</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Course Name</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Course Type</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Credits</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Learning Hours</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Alternative Name</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Course Description</th>
                <th className="px-6 py-3 border-b text-left font-semibold">Edit Course</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.coursecode}>
                    <td className="px-6 py-4 border-b text-gray-700">{course.coursecode}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.coursename}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.coursetype}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.coursecredits}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.learninghours}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.alternativename}</td>
                    <td className="px-6 py-4 border-b text-gray-700">{course.coursedescription}</td>
                    <td className="px-6 py-4 border-b text-gray-700">
                      <button
                        onClick={() => handleEdit(course.coursecode)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 border-b text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
