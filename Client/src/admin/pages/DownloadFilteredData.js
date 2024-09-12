import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';

const studentFields = [
  'registrationid', 'joiningdate', 'nameasperssc', 'studentaadhar', 'mobile', 'alternatemobile',
  'personalemail', 'gender', 'dob', 'branch', 'joiningyear', 'quota',
  'admissiontype', 'fathername', 'mothername', 'fatheraadhar', 'motheraadhar',
  'scholarshipholder', 'permanentaddress', 'permanentpincode', 'currentaddress',
  'currentpincode', 'moa', 'remarks', 'entrancetype', 'entrancehallticket', 'rank',
  'city', 'state', 'nationality', 'religion', 'caste', 'castecategory', 'imgurl'
];

const DownloadFilteredData = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentStatus, setCurrentStatus] = useState('1'); // Default to active students
  const [branches, setBranches] = useState([]);
  const admintoken = Cookies.get('admintoken');

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

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleFieldSelection = (field) => {
    setSelectedFields((prevFields) => {
      if (prevFields.includes(field)) {
        return prevFields.filter((item) => item !== field);
      } else {
        return [...prevFields, field];
      }
    });
  };

  const handleDownload = async () => {
    if (selectedFields.length === 0) {
    toast.error("Please select at least one field to download.");
      return;
    }

    try {
      const url = currentBranch
        ? `http://localhost:3001/admin/downloadstudents/${currentYear}/${currentBranch}`
        : `http://localhost:3001/admin/downloadstudents/${currentYear}`;
        
      const response = await axios.post(
        url,
        { fields: selectedFields, studentstatus: currentStatus },
        { responseType: 'blob', headers: { 'Authorization': `${admintoken}` } }
      );

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Filtered_Students_${currentYear}.xlsx`);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div style={{height : '85vh', overflowY : 'scroll'}} className=" downscroll w-full max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Download Filtered Data</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Year:</label>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
          <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
          <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
          <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>
          <option value={new Date().getFullYear() - 4}>{new Date().getFullYear() - 4}</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch:</label>
        <select
          value={currentBranch}
          onChange={(e) => setCurrentBranch(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.branchcode} value={branch.branchcode}>
              {branch.branchshortcut}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Status:</label>
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="1">Active Students</option>
          <option value="0">Inactive Students</option>
        </select>
      </div>
      <div style={{display : 'flex', justifyContent: 'space-between', alignItems : 'center'}}>
        <h3 className="text-lg font-semibold mb-4 mt-4">Select Fields to Download:</h3>
        <button
        style={{background : '#1A2438'}}
        onClick={handleDownload}
        className="text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-offset-2"
      >
        Download Excel
      </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {studentFields.map((field) => (
          <div key={field} className="mb-2 inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => handleFieldSelection(field)}
              className="mr-2 h-4 w-4 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">{field}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadFilteredData;
