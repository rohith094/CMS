import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './view.css';

const Addstudents = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        defval: '', // Include empty cells
        raw: false, // Let the library handle dates automatically
        dateNF: 'yyyy-mm-dd' // Specify the desired date format
      });

      const formattedData = data.map(row => {
        if (row.joiningdate) {
          row.joiningdate = parseAndFormatDate(row.joiningdate);
        }
        if (row.dob) {
          row.dob = parseAndFormatDate(row.dob);
        }
        // Add similar checks for any other date fields
        return row;
      });

      setData(formattedData);
      setPreview(true);
    };
    reader.readAsBinaryString(selectedFile);
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

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const admintoken = Cookies.get('admintoken');
    try {
      const response = await axios.post('http://localhost:3001/admin/addstudents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${admintoken}`
        },
      });
      toast.success("students added successfully");
      navigate('/admin/studentsdata');
    } catch (error) {
      const errormessage = error.response.data.details;
      toast.error(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='downscroll' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height : '100vh', overflowY : 'scroll', padding : '10px' }}>
      <div className=" bg-white rounded-lg text-center">
        <h2 className="mt-10 text-2xl font-bold">Upload Your File</h2>
        <div className="flex flex-col items-start">
          <label
            style={{ background: "#1A2438" }}
            htmlFor="file_input"
            className="w-full text-sm text-white border border-gray-300 rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2 text-center"
          >
            Choose File
          </label>
          <input
            id="file_input"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-3  mb-4 mx-auto bg-white rounded-lg" >
        {preview && (
          <div style={{margin : '20px', height : '80vh', overflowY : 'scroll'}}>
            <h2 className="text-xl font-semibold mb-4 ">Preview</h2>
            <div style={{width:"70vw"}} className="overflow-x-auto downscroll">
              <table style={{height : ''}} className=" bg-white border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              style={{ background: "#1A2438" }}
              onClick={handleSubmit}
              className={`mt-4 w-full py-2 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        )}
    </div>
    </div>
  );
};

export default Addstudents;