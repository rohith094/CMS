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
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setPreview(true);
    };
    reader.readAsBinaryString(selectedFile);
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
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
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

      <div className="mt-3 mb-4 mx-auto bg-white rounded-lg">
        {preview && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div style={{width:"70vw"}} className="overflow-x-auto downscroll">
              <table  className=" bg-white border border-gray-200">
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