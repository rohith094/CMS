import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const BulkUploadFaculty = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('admintoken');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setMessage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      setFileData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/admin/addfaculties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      });

      const { message } = response.data;
      setMessage(message);

      if (message.includes('skipped')) {
        toast.warn('Some faculty codes were skipped due to duplicates');
      } else {
        toast.success('Faculty uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload faculty. Please try again.');
      toast.error('Error uploading faculty data');
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setFileData([]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload Faculty Data</h2>

        <label className="block text-gray-700 font-medium mb-2" htmlFor="fileInput">
          Select Excel File:
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full px-2 py-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />

        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
            isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } mb-4`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              Uploading...
            </div>
          ) : (
            'Upload Faculty Data'
          )}
        </button>

        {fileData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview:</h3>
            <div className="max-h-72 border border-gray-200 rounded-lg overflow-y-auto">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {Object.keys(fileData[0]).map((key, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4">
            <p className={message.includes('skipped') ? 'text-yellow-600' : 'text-green-600'}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUploadFaculty;
