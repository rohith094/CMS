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
    navigate('/admin/studentsdata');
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

  const fetchStudents = async (yearToFetch, branchToFetch = '') => {
    setLoading(true);
    try {
      const url = branchToFetch
        ? `http://localhost:3001/admin/admissionstudents/${yearToFetch}/${branchToFetch}`
        : `http://localhost:3001/admin/admissionstudents/${yearToFetch}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `${admintoken}`,
        },
      });
      setStudents(response.data.students);
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
    fetchStudents(currentYear, currentBranch);
  }, [currentYear, currentBranch]);

  return (
    <div style={{ width: '97%', height: '94vh', borderRadius: '6px' }} className="sticky top-0">
      <div style={{ display: 'flex', justifyContent: 'space-around' , paddingTop : '10px'}}>
      <div style={{ marginBottom: '10px', borderRadius: '8px', padding : '15px' , boxShadow : 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
          <strong>Total Count:</strong> {maleCount + femaleCount}
      </div>
      <div style={{ marginBottom: '10px',borderRadius: '8px', padding : '15px' , boxShadow : 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
          <strong>Male Count:</strong> {maleCount}
      </div>
      <div style={{ marginBottom: '10px',borderRadius: '8px', padding : '15px' , boxShadow : 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px' }}>
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
        </div>

        <button
          onClick={handleBack}
          style={{ background: '#1A2438', width: '200px', height: '45px' }}
          className="mt-2 text-white rounded-md"
        >
          Back
        </button>
      </div>
      <div style={{ width: '97%', height: '70vh', borderRadius: '6px' }} className="overflow-y-scroll scroll-hidden downscroll mt-4">

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-cyan-200 h-12 w-12"></div>
          </div>
        ) : (
          <>
          <div style={{width : '100%', height : '1px', background : "#1A2438"}} className='sticky top-0 p-0 m-0'></div>
          <table style={{ width: '100%'}} className="bg-white mt-0">
            <thead className='sticky top-0' style={{ background: '#1A2438', color: 'white'}}>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Application Number</th>
                <th className="py-3 px-4">Registration ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">View</th>
                <th className="py-3 px-4">Edit</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.jntuno} className="border-b">
                  <td className="py-3 px-4">{student.applicationnumber}</td>
                  <td style={{ textTransform: 'uppercase' }} className="py-3 px-4">{student.registrationid}</td>
                  <td style={{ textTransform: 'capitalize' }} className="py-3 px-4">{student.nameasperssc}</td>
                  <td className="py-3 px-4">
                    <img src={student.imgurl} alt="Profile" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-3 px-6">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => handleDetails(index)}>
                      <IoEye />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-black-500 hover:text-blue-700" onClick={() => handleUpdate(index)}>
                      <FaUserEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>

    </div>
  );
};

export default ViewAdmissions;
