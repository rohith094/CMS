import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Singlestudent = () => {
  const { jntuno } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const admintoken = Cookies.get('admintoken');
  useEffect(() => {
    const fetchStudent = async () => {

      try {
        const response = await axios.get(`http://localhost:3001/admin/singlestudent/${jntuno}`,{
          headers: {
            'Authorization': `${admintoken}`
          }
        });
        console.log(response);
        setStudent(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [jntuno]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Data</h1>
      {student && (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
          <img
            src={student.imageurl}
            alt={`${student.firstname} ${student.lastname}`}
            style={{width : '160px', height : '160px', borderRadius : '5px'}}
          />
          <div className="text-sm">
            <p><strong>JNTU No:</strong> {student.jntuno}</p>
            <p><strong>First Name:</strong> {student.firstname}</p>
            <p><strong>Last Name:</strong> {student.lastname}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Password:</strong> {student.password}</p>
            <p><strong>Branch:</strong> {student.branch}</p>
            <p><strong>Joining Year:</strong> {student.joiningyear}</p>
            <p><strong>Current Year:</strong> {student.currentyear}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Singlestudent;
