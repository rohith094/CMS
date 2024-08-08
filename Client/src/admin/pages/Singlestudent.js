
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Singlestudent = () => {
  const { jntuno } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const admintoken = Cookies.get('admintoken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/singlestudent/${jntuno}`, {
          headers: {
            'Authorization': `${admintoken}`
          }
        });
        setStudent(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [jntuno, admintoken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return toast.error('An error occurred');
  }

  const handleBack = () => {
    navigate('/admin/studentsdata/viewstudents');
  }

  return (
    <div className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 w-full max-w-[48rem] flex-row mx-auto my-8">
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0"
      >
        <img
          style={{ width: '75%', height: '75%', borderRadius: '8px' }}
          src={student.imageurl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1471&amp;q=80"}
          alt={`${student.firstname || 'Student'} ${student.lastname || ''}`}
          className="object-cover"
        />
      </div>
      <div className="p-6">
      <table className="min-w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">JNTU No</td>
              <td className="px-4 py-2">{student.jntuno}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">First Name</td>
              <td className="px-4 py-2">{student.firstname}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Last Name</td>
              <td className="px-4 py-2">{student.lastname}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Email</td>
              <td className="px-4 py-2">{student.email}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Password</td>
              <td className="px-4 py-2">********</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Branch</td>
              <td className="px-4 py-2">{student.branch}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Joining Year</td>
              <td className="px-4 py-2">{student.joiningyear}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Current Year</td>
              <td className="px-4 py-2">{student.currentyear}</td>
            </tr>
          </tbody>
        </table>
        <button
          style={{width : '400px'}}
          onClick={handleBack}
          className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Singlestudent;
