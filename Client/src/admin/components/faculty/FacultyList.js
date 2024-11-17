import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchBy, setSearchBy] = useState('facultyname');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('admintoken');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(debouncedQuery ? false : true);
      setSearchLoading(debouncedQuery ? true : false);

      try {
        const response = await axios.get('http://localhost:3001/admin/faculty/search', {
          headers: { Authorization: `${token}` },
          params: { searchBy: searchBy, keyword: debouncedQuery },
        });
        setFaculties(response.data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };

    fetchFaculties();
  }, [debouncedQuery, searchBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8" style={{ height: "100vh", width: "100vw" }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty List</h1>

      <div className="flex justify-center mb-6 sticky top-0 bg-white z-10">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        >
          <option value="facultyname">Faculty Name</option>
          <option value="facultycode">Faculty Code</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy === 'facultyname' ? 'Faculty Name' : 'Faculty Code'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-auto max-h-75vh mx-3 border border-gray-200 rounded-lg">
        {searchLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Designation</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">View</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faculties.length > 0 ? (
                faculties.map((faculty) => (
                  <tr key={faculty.facultycode}>
                    <td className="px-4 py-2 text-sm text-gray-700">{faculty.facultycode}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{faculty.facultyname}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{faculty.facultyemail}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{faculty.facultydesignation}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{faculty.facultybranch}</td>
                    <td className="px-4 py-2 text-blue-600 hover:text-blue-800">
                      <Link to={`/admin/facultycomponent/viewfaculty/view/${faculty.facultycode}`}>
                        <FaRegEye />
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-blue-600 hover:text-blue-800">
                      <Link to={`/admin/facultycomponent/viewfaculty/edit/${faculty.facultycode}`}>
                        <FaEdit />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                    No faculties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyList;
