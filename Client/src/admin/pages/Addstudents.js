import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Addstudents = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState(false);

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
      toast.success(response.data);
      navigate('/admin/studentsdata');
      // alert(response.data);
    } catch (error) {
      console.error('An error occurred while adding students:', error);
      // alert('An error occurred');
      toast.error('An error occured');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {preview && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <table className="min-w-full bg-white border border-gray-200">
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
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Addstudents;