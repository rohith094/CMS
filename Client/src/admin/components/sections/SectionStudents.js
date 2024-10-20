import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
const SectionStudents = () => {
  const { sectioncode } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = Cookies.get('admintoken');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/admin/sectionstudents/${sectioncode}`,{
          headers :{
            Authorization : `${token}`
          }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch students');
        setLoading(false);
      }
    };
    fetchStudents();
  }, [sectioncode]);

  const handleMapStudents = async () => {
    setButtonLoading(true);
    // Perform any action related to "Map Students"
    setTimeout(() => setButtonLoading(false), 1000);
    navigate(`mapstudents`);
     // Simulate button loading
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Section {sectioncode} Students</h1>
        <button
          onClick={handleMapStudents}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full inline-block"
              viewBox="0 0 24 24"
            ></svg>
          ) : (
            'Map Students'
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : students.length === 0 ? (
        <p>No students found for this section.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Registration ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.registrationid}>
                <td className="border border-gray-300 px-4 py-2">{student.registrationid}</td>
                <td className="border border-gray-300 px-4 py-2">{student.nameasperssc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SectionStudents;
