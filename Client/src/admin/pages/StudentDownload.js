import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';

const StudentDownload = () => {
  const [currentYear, setCurrentYear] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const admintoken = Cookies.get('admintoken');

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/admin/filterstudents/download', {
        params: { currentyear: currentYear, branch },
        headers: {
          'Authorization': `${admintoken}`
        }
      });

      const students = response.data;
      const worksheet = XLSX.utils.json_to_sheet(students);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

      XLSX.writeFile(workbook, 'students.xlsx');
    } catch (error) {
      console.error('Error downloading students:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '97%', height: '94vh', borderRadius: '6px' ,display:"flex",flexDirection:"column",justifyContent:"center"}} className="p-4">
      <div  className="mb-6">
        <label className="block text-gray-700">Current Year:</label>
        <select
        style={{width:"100%"}}
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

      <div className="mb-6">
        <label className="block text-gray-700">Branch:</label>
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full mt-4 p-2 border border-gray-300 rounded"
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
        style={{background:"#1A2438"}}
        onClick={downloadExcel}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Downloading...' : 'Download as Excel'}
      </button>
    </div>
  );
};

export default StudentDownload;