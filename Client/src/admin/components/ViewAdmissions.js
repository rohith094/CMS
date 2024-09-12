import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoEye } from 'react-icons/io5';
import { FaUserEdit } from 'react-icons/fa';
import { AiTwotoneDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const ViewAdmissions = () => {
  const year = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(year.toString());
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentStatus, setCurrentStatus] = useState('1'); // Default to active students
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const admintoken = Cookies.get('admintoken');

  const handleDetails = (index) => {
    const registrationid = students[index].registrationid;
    navigate(`/admin/admissions/viewstudent/${registrationid}`);
  };

  const handleUpdate = (index) => {
    const registrationid = students[index].registrationid;
    navigate(`/admin/admissions/updatestudent/${registrationid}`);
  };

  const handleBack = () => {
    navigate('/admin/admissions');
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/branches', {
        headers: {
          'Authorization': `${admintoken}`,
        },
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchStudents = async (yearToFetch, branchToFetch = '', statusToFetch = '1') => {
    setLoading(true);
    try {
      const url = branchToFetch
        ? `http://localhost:3001/admin/admissionstudents/${yearToFetch}/${branchToFetch}?studentstatus=${statusToFetch}`
        : `http://localhost:3001/admin/admissionstudents/${yearToFetch}?studentstatus=${statusToFetch}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `${admintoken}`,
        },
      });
      setStudents(response.data.students);
      console.log(response.data.students);
      setMaleCount(response.data.maleCount);
      setFemaleCount(response.data.femaleCount);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchStudents(currentYear, currentBranch, currentStatus);
  }, [currentYear, currentBranch, currentStatus]);

  return (
    <div style={{ width: '97%', height: '94vh', borderRadius: '6px' }} className="sticky top-0">
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px' }}>
        <div style={{ marginBottom: '10px', borderRadius: '8px', padding: '15px', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
          <strong>Total Count:</strong> {maleCount + femaleCount}
        </div>
        <div style={{ marginBottom: '10px', borderRadius: '8px', padding: '15px', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
          <strong>Male Count:</strong> {maleCount}
        </div>
        <div style={{ marginBottom: '10px', borderRadius: '8px', padding: '15px', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
          <strong>Female Count:</strong> {femaleCount}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="mb-4">
          <select
            style={{ width: '200px', marginRight: '10px' }}
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value={year}>{year}</option>
            <option value={year - 1}>{year - 1}</option>
            <option value={year - 2}>{year - 2}</option>
            <option value={year - 3}>{year - 3}</option>
            <option value={year - 4}>{year - 4}</option>
          </select>

          <select
            style={{ width: '200px' }}
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.branchcode} value={branch.branchcode}>
                {branch.branchshortcut}
              </option>
            ))}
          </select>

          <select
            style={{ width: '200px', marginTop: '10px' }}
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            className="w-full ml-2 mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="1">Active Students</option>
            <option value="0">Inactive Students</option>
          </select>
        </div>

        <button
          onClick={handleBack}
          style={{ background: '#1A2438', width: '200px', height: '45px' }}
          className="mt-2 text-white rounded-md"
        >
          Back
        </button>
      </div>
      <div style={{ width: '97%', height: '65vh', borderRadius: '6px' }} className="overflow-y-scroll scroll-hidden downscroll mt-4">

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-cyan-200 h-12 w-12"></div>
          </div>
        ) : (
          <>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center' }} className="mt-4 text-lg">No students found for this selection.</div>
            ) : (
              <>
              <div style={{width : '100vw', height : '1px', borderRadius : '2px'}}></div>
              <table style={{width : '100vw', overflowX : 'scroll'}} className="bg-white border border-gray-300">
                <thead className='sticky top-0 bg-black text-white'>
                  <tr>
                    <th className="py-3 px-2 border-b text-left">Profile</th>
                    <th className="py-3 px-2 border-b text-left">RegistrationID</th>
                    <th className=" py-3 px-2 border-b text-left">Application Number</th>
                    <th className="py-3 px-2 border-b text-left">NameasperSSC</th>
                    <th className=" py-3 px-2 border-b text-left">Gender</th>
                    <th className=" py-3 px-2 border-b text-left">Status</th>
                    <th className=" py-3 px-2 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.registrationid}>
                      <td className="py-4 px-3 border-b">
                        <img style={{width : '70px', height : '70px', borderRadius : '100%'}} 
                        src={student.imgurl} alt='studentimage'
                        >
                        </img>
                      </td>
                      <td className="py-3 px-2 border-b">{student.registrationid}</td>
                      <td className="py-3 px-2 border-b">{student.applicationnumber}</td>
                      <td className="py-3 px-2 border-b">{student.nameasperssc}</td>
                      <td className="py-3 px-2 border-b">{student.gender}</td>
                      <td className="py-3 px-2 border-b">{student.studentstatus === 1 ? 'Active' : 'Inactive'}</td>
                      <td className="py-3 px-2 border-b text-center">
                        <button
                          onClick={() => handleDetails(index)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <IoEye size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdate(index)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          <FaUserEdit size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAdmissions;
