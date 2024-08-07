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
      toast.error('An error occured')
    );
  }

  const handleBack = () => {
    navigate('/admin/studentsdata/viewstudents')
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mx-auto">
      {student && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <img
            className='mr-10'
            src={student.imageurl}
            alt={`${student.firstname} ${student.lastname}`}
            style={{ width: '200px', height: '200px', borderRadius: '5px' }}
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
            <button
              onClick={handleBack}
              style={{ background: "#1A2438", width: '200px', height: '45px' }}
              className="mt-2 text-white rounded-md"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Singlestudent;
