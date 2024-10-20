import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const MapStudents = () => {
  const { sectioncode, branchcode } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get('admintoken');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/admin/sectionstudentsbysemester/${sectioncode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const studentsWithoutSectionCode = response.data.filter(student => !student.sectioncode);
        setStudents(studentsWithoutSectionCode);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [sectioncode, token]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSelected = students.map(student => student.registrationid.trim());
      setSelectedStudents(allSelected);
    }
  };

  const handleDeselectAll = (event) => {
    if (event.target.checked) {
      setSelectedStudents([]);
    }
  };

  const handleCheckboxChange = (registrationId) => {
    const trimmedId = registrationId.trim();
    setSelectedStudents(prevSelected => 
      prevSelected.includes(trimmedId) 
      ? prevSelected.filter(id => id !== trimmedId) 
      : [...prevSelected, trimmedId]
    );
  };

  const handleMapStudents = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.post(`http://localhost:3001/admin/mapstudentstosection/${sectioncode}`, {
        registrationids: selectedStudents,
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success(response.data.message);
      setSelectedStudents([]);
      navigate(`/admin/sections/${branchcode}/${sectioncode}`);
    } catch (error) {
      console.error('Error mapping students to section:', error);
      toast.error("Error mapping students");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/admin/sections/${branchcode}/${sectioncode}`); // Change this to your desired back route
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Map Students</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <svg
            className="animate-spin h-10 w-10 text-green-500"
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
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-between mb-4">
            <div>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedStudents.length === students.length}
              /> Select All
              <input
                type="checkbox"
                onChange={handleDeselectAll}
                className="ml-4"
              /> Deselect All
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleBackButtonClick}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
              >
                Back
              </button>
              <button
                onClick={handleMapStudents}
                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 ${buttonLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={buttonLoading || selectedStudents.length === 0}
              >
                {buttonLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8v8l3.09-3.09a6 6 0 11-6.16 0L8 12z"
                    ></path>
                  </svg>
                ) : (
                  'Map Selected Students'
                )}
              </button>
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester Number</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.registrationid}>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.registrationid.trim())}
                      onChange={() => handleCheckboxChange(student.registrationid)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.registrationid}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.nameasperssc}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.semesternumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MapStudents;
