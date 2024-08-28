import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';

const DownloadCourses = () => {
  const { branchcode } = useParams(); // Get branch code from URL params
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('admintoken');

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/admin/downloadcourses/${branchcode}`, {
        headers : {
          Authorization : `${token}`
        }
      });
      const courses = response.data;

      if (courses.length > 0) {
        // Prepare CSV data with headers
        const headers = Object.keys(courses[0]).join(','); // Create headers row
        const csvData = courses.map((course) =>
          Object.values(course).join(',')
        ).join('\n'); // Join each course row

        // Combine headers and data
        const csvContent = `${headers}\n${csvData}`;

        // Convert CSV content to Blob and save it using file-saver
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `courses_${branchcode}.csv`);
      } else {
        alert('No courses found for this branch.');
      }
    } catch (error) {
      console.error('An error occurred while downloading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Download Courses for Branch: {branchcode}</h2>
        <div className="flex items-center justify-between">
          <button
            style={{background : '#1A2438'}}
            onClick={handleDownload}
            className={` text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Downloading...' : 'Download All Courses'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCourses;
