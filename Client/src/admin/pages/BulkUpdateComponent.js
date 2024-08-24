import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const BulkUpdateComponent = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const studentFields = [
    'registrationid','joiningdate', 'nameasperssc', 'studentaadhar', 'mobile', 'alternatemobile',
    'personalemail', 'gender', 'dob', 'branch', 'joiningyear', 'quota',
    'admissiontype', 'fathername', 'mothername', 'fatheraadhar', 'motheraadhar',
    'scholarshipholder', 'permanentaddress', 'permanentpincode', 'currentaddress',
    'currentpincode', 'moa', 'remarks', 'entrancetype', 'entrancehallticket', 'rank',
    'city', 'state', 'nationality', 'religion', 'caste', 'castecategory'
  ];

  const handleFieldSelection = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFields([]);
    } else {
      setSelectedFields(studentFields);
    }
    setSelectAll(!selectAll);
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
      const data = XLSX.utils.sheet_to_json(sheet, {
        defval: '', // Include empty cells
        raw: false, // Let the library handle dates automatically
        dateNF: 'yyyy-mm-dd' // Specify the desired date format
      });
  
      // Explicitly format date fields if necessary
      const formattedData = data.map(row => {
        if (row.joiningdate) {
          row.joiningdate = parseAndFormatDate(row.joiningdate);
        }
        if (row.dob) {
          row.dob = parseAndFormatDate(row.dob);
        }
        // Add similar checks for any other date fields
        return row;
      }); // Include empty cells
      setExcelData(formattedData);
    };
    reader.readAsBinaryString(file);
  };


  const parseAndFormatDate = (dateString) => {
    // Check if the value is already a valid date
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate)) {
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const year = parsedDate.getFullYear();
      return `${year}-${month}-${day}`;
    }
  
    // If not, try to parse assuming the input is in 'dd-mm-yyyy' format
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is zero-indexed in JS
      const year = parseInt(parts[2], 10);
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate)) {
        const formattedDay = String(newDate.getDate()).padStart(2, '0');
        const formattedMonth = String(newDate.getMonth() + 1).padStart(2, '0');
        const formattedYear = newDate.getFullYear();
        return `${formattedYear}-${formattedMonth}-${formattedDay}`;
      }
    }
  
    // If the date is still invalid, return the original string or a fallback
    console.warn('Invalid date value:', dateString);
    return dateString; // or return '' to skip invalid dates
};

  

  const handleBulkUpdate = async () => {
    try {
      const token = Cookies.get('admintoken'); // Get the token from cookies
  
      if (!token) {
        alert('Authorization token is missing!');
        return;
      }
  
      const selectedData = excelData.map(row => {
        const newRow = {};
        selectedFields.forEach(field => {
          newRow[field] = row[field];
        });
        return newRow;
      });
  
      const worksheet = XLSX.utils.json_to_sheet(selectedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBlob = new Blob(
        [XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      );
  
      const formData = new FormData();
      formData.append('excelFile', excelBlob, fileName);
  
      console.log("Sending data:", selectedData); // Debug: Log the data being sent
      console.log("FormData:", formData); // Debug: Log the FormData object
  
      const response = await axios.put('http://localhost:3001/admin/students/bulkupdate', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}` // Add the authorization header
        }
      });
  
      console.log("Server Response:", response); // Debug: Log the response from the server
  
      if (response.status === 200) {
        
         toast.success('Bulk update successful!');
         navigate('/admin/admissions/viewadmissions');

      } else {
        toast.error(`Bulk update failed `);
      }
    } catch (error) {
      console.error('Bulk update failed:', error);
      toast.error('Bulk update failed!');
    }
  };
  

  return (
    <div style={{height : "85vh", overflowY : 'scroll'}} className=" downscroll p-6  min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Bulk Update Students</h2>

      <div className="bg-white p-6 rounded-lg  w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Select Fields to Update</h3>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              onChange={handleSelectAll}
              checked={selectAll}
            />
            <span className="ml-2 text-gray-700">Select All Fields</span>
          </label>
        </div>
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
          <div style={{overflowX : 'scroll'}} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6 downscroll">
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
          style={{background : "#415A77"}}
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
