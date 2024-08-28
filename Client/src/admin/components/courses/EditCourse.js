import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const EditCourse = () => {
  const { coursecode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({
    coursename: '',
    alternativename: '',
    coursedescription: '',
    coursetype: 'lecture', // Default value
    coursecredits: '',
    learninghours: '',
    coursecredits2: '',
    learninghours2: ''
  });

  const token = Cookies.get('admintoken');
  const {branchcode } =  useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/course/${coursecode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCourse(response.data);
        setCourseData({
          coursename: response.data.coursename,
          alternativename: response.data.alternativename,
          coursedescription: response.data.coursedescription,
          coursetype: response.data.coursetype,
          coursecredits: response.data.coursecredits,
          learninghours: response.data.learninghours,
          coursecredits2: response.data.coursecredits2 || '',
          learninghours2: response.data.learninghours2 || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [coursecode]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/admin/updatecourse', { coursecode, ...courseData }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success('course updated succesfull');
      navigate(`/admin/branch/${branchcode}/viewcourses`); // Navigate to the course list or course detail page after update
    } catch (error) {
      toast.error('error updating course');
      console.error('Error updating course:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{height : '100vh', overflowY : 'scroll', margin : '0px 10px '}} className=" downscroll container py-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Course Name</label>
          <input
            type="text"
            name="coursename"
            value={courseData.coursename}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Alternative Name</label>
          <input
            type="text"
            name="alternativename"
            value={courseData.alternativename}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Course Description</label>
          <textarea
            name="coursedescription"
            value={courseData.coursedescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Course Type</label>
          <select
            name="coursetype"
            value={courseData.coursetype}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="lecture">Lecture</option>
            <option value="practical">Practical</option>
            <option value="integrated">Integrated</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Course Credits</label>
          <input
            type="number"
            name="coursecredits"
            value={courseData.coursecredits}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Learning Hours</label>
          <input
            type="number"
            name="learninghours"
            value={courseData.learninghours}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {courseData.coursetype === 'integrated' && (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Course Credits</label>
              <input
                type="number"
                name="coursecredits2"
                value={courseData.coursecredits2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Learning Hours</label>
              <input
                type="number"
                name="learninghours2"
                value={courseData.learninghours2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}
        <button
        style={{background : '#1A2438'}}
          type="submit"
          className="w-full text-white px-4 py-2 rounded-md"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
