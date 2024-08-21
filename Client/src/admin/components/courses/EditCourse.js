import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
  const [formData, setFormData] = useState({
    coursecode: '',
    coursename: '',
    coursecredits: '',
    semesternumber: '',
    branchcode: '',
    coursetype: ''
  });
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const { coursecode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch semesters and branches for dropdowns
    const fetchSemesters = async () => {
      try {
        const token = Cookies.get('admintoken');
        const response = await axios.get('http://localhost:3001/admin/allsemesters', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setSemesters(response.data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    const fetchBranches = async () => {
      try {
        const token = Cookies.get('admintoken');
        const response = await axios.get('http://localhost:3001/admin/branches', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    const fetchCourse = async () => {
      try {
        const token = Cookies.get('admintoken');
        const response = await axios.get(`http://localhost:3001/admin/course/${coursecode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchSemesters();
    fetchBranches();
    fetchCourse();
  }, [coursecode]);

  const goback = () => {
    navigate('/admin/courses');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('admintoken');
      await axios.put(
        `http://localhost:3001/admin/course/${coursecode}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleEditCourse} className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Course</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course Code:</label>
          <input
            type="text"
            name="coursecode"
            value={formData.coursecode}
            onChange={handleInputChange}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course Name:</label>
          <input
            type="text"
            name="coursename"
            value={formData.coursename}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course Credits:</label>
          <input
            type="number"
            name="coursecredits"
            value={formData.coursecredits}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Semester Number:</label>
          <select
            name="semesternumber"
            value={formData.semesternumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semesternumber} value={semester.semesternumber}>
                {semester.semesternumber} - {semester.semestername}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Code:</label>
          <select
            name="branchcode"
            value={formData.branchcode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branchcode} value={branch.branchcode}>
                {branch.branchcode} - {branch.branchname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course Type:</label>
          <input
            type="text"
            name="coursetype"
            value={formData.coursetype}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Save Changes
        </button>

        <button 
          type="button"
          className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          onClick={goback}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
