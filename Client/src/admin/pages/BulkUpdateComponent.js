import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Cookies from 'js-cookie';

const BulkUpdateComponent = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');

  const studentFields = [
    'joiningdate', 'nameasperssc', 'studentaadhar', 'mobile', 'alternatemobile',
    'personalemail', 'gender', 'dob', 'branch', 'joiningyear', 'quota',
    'admissiontype', 'fathername', 'mothername', 'fatheraadhar', 'motheraadhar',
    'scholarshipholder', 'permanentaddress', 'permanentpincode', 'currentaddress',
    'currentpincode', 'moa', 'remarks', 'entrancetype', 'entrancehallticket', 'rank',
    'city', 'state', 'nationality', 'religion', 'caste', 'castecategory', 'studentstatus'
  ];

  const handleFieldSelection = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setExcelData(data);
    };

    reader.onerror = (error) => {
      console.error("File could not be read: ", error);
      alert("Failed to read file. Please check the file format.");
    };

    reader.readAsBinaryString(file); // Ensure reading as binary string
  };

  const handleBulkUpdate = async () => {
    try {
      const token = Cookies.get('admintoken'); // Get the token from cookies

      if (!token) {
        alert('Authorization token is missing!');
        return;
      }

      const formData = new FormData();
      formData.append('excelFile', new Blob([XLSX.write(XLSX.utils.json_to_sheet(excelData), {bookType: 'xlsx', type: 'array'})], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
      
      await axios.put('http://localhost:3001/admin/students/bulkupdate', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add the authorization header
        }
      });

      alert('Bulk update successful!');
    } catch (error) {
      console.error('Bulk update failed:', error);
      alert('Bulk update failed!');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Bulk Update Students</h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Select Fields to Update</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {studentFields.map((field, index) => (
            <label key={index} className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                onChange={() => handleFieldSelection(field)}
                checked={selectedFields.includes(field)}
              />
              <span className="ml-2 text-gray-700">{field}</span>
            </label>
          ))}
        </div>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {fileName && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
            <h4 className="text-lg font-medium mb-2">Preview: {fileName}</h4>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {selectedFields.map((field, index) => (
                    <th key={index} className="py-2 px-4 border-b text-left">{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {selectedFields.map((field, index) => (
                      <td key={index} className="py-2 px-4 border-b">{row[field] || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleBulkUpdate}
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Update Students
        </button>
      </div>
    </div>
  );
};

export default BulkUpdateComponent;
