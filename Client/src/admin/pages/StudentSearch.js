import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoEye } from 'react-icons/io5';
import { FaUserEdit } from 'react-icons/fa';
import { AiTwotoneDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const StudentSearch = () => {
  const [currentYear, setCurrentYear] = useState('');
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const admintoken = Cookies.get('admintoken');

  const handleDetails = (index) => {
    const jntuno = students[index].jntuno;
    navigate(`/admin/studentsdata/viewstudents/${jntuno}`);
  };

  const handleUpdate = (index) => {
    const jntuno = students[index].jntuno;
    navigate(`/admin/studentsdata/updatestudent/${jntuno}`);
  };

  const handleDelete = (index) => {
    const jntuno = students[index].jntuno;
    navigate(`/admin/studentsdata/deletestudent/${jntuno}`);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/admin/filterstudents', {
        params: { currentyear: currentYear, branch },
        headers: {
          'Authorization': `${admintoken}`
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const handleBack = ()=>{
    navigate('/admin/studentsdata');
  }

  return (
    <div style={{ width: '97%', height: '94vh', borderRadius: '6px' }} className="p-4">
      <div style={{display : 'flex', justifyContent : 'space-between'}}>
      <div className="mb-4">
        <select
          style={{width : '200px'}}
          value={currentYear}
          onChange={(e) => setCurrentYear(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      <div className="mb-4">
        <select
        style={{width : '200px'}}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="AIML">AIML</option>
          <option value="AIDS">AIDS</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="IT">IT</option>
          <option value="CIVIL">CIVIL</option>
          <option value="MECH">MECH</option>
          <option value="CHEM">CHEM</option>
        </select>
      </div>
      <button
            onClick={fetchStudents}
            style={{ background: "#1A2438" , width : '200px', height : '45px'}}
            className="mt-2 text-white rounded-md"
          >
            Fetch Data
          </button>
          <button
            onClick={handleBack}
            style={{ background: "#1A2438" , width : '200px', height : '45px'}}
            className="mt-2 text-white rounded-md"
          >
            Back
          </button>
      </div>

      <div style={{ width: '97%', height: '94vh', borderRadius: '6px' }} className="overflow-y-scroll scroll-hidden downscroll mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-cyan-200 h-12 w-12"></div>
          </div>
        ) : (
          <table style={{ width: '100%' }} className="bg-white border border-gray-200">
            <thead style={{ background: '#1A2438', color: 'white' }}>
              <tr className="text-left border-b">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 px-4">JNTU No.</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">View</th>
                <th className="py-3 px-4">Edit</th>
                <th className="py-3 px-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.jntuno} className="border-b">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td style={{ textTransform: 'uppercase' }} className="py-3 px-4">{student.jntuno}</td>
                  <td style={{ textTransform: 'capitalize' }} className="py-3 px-4">{student.firstname} {student.lastname}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">
                    <img src={student.imageurl} alt="Profile" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-3 px-6">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => handleDetails(index)}>
                      <IoEye />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-black-500 hover:text-blue-700" onClick={() => handleUpdate(index)}><FaUserEdit /></button>
                  </td>
                  <td className="py-3 px-4" onClick={() => handleDelete(index)}>
                    <button className="text-red-500 hover:text-red-700"><AiTwotoneDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;