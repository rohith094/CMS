import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const EditSection = () => {
  const section  = useParams();
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sectionId = section.sectionID;

  console.log(sectionId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('admintoken');
        
        // Fetch branches
        const branchResponse = await axios.get('http://localhost:3001/admin/branches', {
          headers: { Authorization: `${token}` },
        });
        setBranches(branchResponse.data);

        // Fetch semesters
        const semesterResponse = await axios.get('http://localhost:3001/admin/allsemesters', {
          headers: { Authorization: `${token}` },
        });
        setSemesters(semesterResponse.data);

        // Fetch section details
        const sectionResponse = await axios.get(`http://localhost:3001/admin/section/${sectionId}`, {
          headers: { Authorization: `${token}` },
        });


        const section = sectionResponse.data;
        setSectionName(section.SectionName);
        setBranchId(section.BranchID);
        setSemesterId(section.SemesterID);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      await axios.put(`http://localhost:3001/admin/editsection/${sectionId}`, {
        SectionName: sectionName,
        BranchID: branchId,
        SemesterID: semesterId,
      }, {
        headers: { Authorization: `${token}` },
      });
      navigate('/sections');
    } catch (error) {
      console.error('Error updating section:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Section</h2>
        <div className="mb-4">
          <label htmlFor="sectionName" className="block text-gray-700 font-semibold mb-2">Section Name</label>
          <input
            type="text"
            id="sectionName"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="branchId" className="block text-gray-700 font-semibold mb-2">Branch</label>
          <select
            id="branchId"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Branch</option>
            {branches.map(branch => (
              <option key={branch.BranchID} value={branch.BranchID}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="semesterId" className="block text-gray-700 font-semibold mb-2">Semester</label>
          <select
            id="semesterId"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Semester</option>
            {semesters.map(semester => (
              <option key={semester.SemesterID} value={semester.SemesterID}>
                {semester.SemesterNumber}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Section'}
        </button>
        <button
          type="button"
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          onClick={() => navigate('/admin/sections')}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditSection;
