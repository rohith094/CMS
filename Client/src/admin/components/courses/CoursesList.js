import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const CoursesList = () => {
  const { branchcode } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('admintoken');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/courses/${branchcode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [branchcode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No courses available for this branch.</p>
      </div>
    );
  }

  return (
    <div style={{width : '100%'}} className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Courses for Branch: {branchcode}</h1>
      <div className="downscroll overflow-x-auto">
        <table style={{width : '85vw',height : '75vh', overflowX : 'scroll', overflowY : 'scroll'}} className="sticky top-0 bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Course Code</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Course Name</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Course Type</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Credits</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Learning Hours</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Alternative Name</th>
              <th className="px-6 py-3 border-b text-left text-gray-800 font-semibold">Course Description</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.coursecode}>
                <td className="px-6 py-4 border-b text-gray-700">{course.coursecode}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.coursename}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.coursetype}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.coursecredits}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.learninghours}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.alternativename}</td>
                <td className="px-6 py-4 border-b text-gray-700">{course.coursedescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesList;
