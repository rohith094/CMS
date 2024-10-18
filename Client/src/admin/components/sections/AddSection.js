import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AddSection = () => {
  const {branchcode}=useParams();
  
  // const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [branchCode, setBranchCode] = useState(branchcode);
  const [semesterNumber, setSemesterNumber] = useState('');
  const [sectionStrength, setSectionStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch branches and semesters on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('admintoken');


        const semesterResponse = await axios.get('http://localhost:3001/admin/activesemesters', {
          headers: { Authorization: `${token}` },
        });
        setSemesters(semesterResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      console.log(sectionName,sectionStrength,branchCode,semesterNumber);
      await axios.post('http://localhost:3001/admin/addsection', {
        sectionname: sectionName, // Match backend naming convention
        sectionstrength: sectionStrength,
        branchcode: branchCode,
        semesternumber: semesterNumber,
      }, {
        headers: { Authorization: `${token}` },
      });
     
      // navigate('/admin/sections');
      navigate(-1);
    } catch (error) {
      console.error('Error adding section:', error);
    } finally {
      setLoading(false);
    }
  };

  // Go back to sections
  const goback = () => {
    navigate(-1);
  };
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Section</h2>

        {/* Section Name Field */}
        <div className="mb-4">
          <label htmlFor="sectionName" className="block text-gray-700 font-semibold mb-2">Section Name</label>
          <input
            type="text"
            id="sectionName"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Section Strength Field */}
        <div className="mb-4">
          <label htmlFor="sectionStrength" className="block text-gray-700 font-semibold mb-2">Section Strength</label>
          <input
            type="number"
            id="sectionStrength"
            value={sectionStrength}
            onChange={(e) => setSectionStrength(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Branch Select Field */}
        <div className="mb-4">
          <label htmlFor="branchCode" className="block text-gray-700 font-semibold mb-2">Branch</label>
          <input
            id="branchCode"
            value={branchcode}
            // onChange={(e) => setBranchCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            disabled
          />
        </div>

        {/* Semester Select Field */}
        <div className="mb-4">
          <label htmlFor="semesterNumber" className="block text-gray-700 font-semibold mb-2">Semester</label>
          <select
            id="semesterNumber"
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Semester</option>
            {semesters.map(semester => (
              <option key={semester.semesternumber} value={semester.semesternumber}>
                {semester.semesternumber}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Section'}
        </button>

        {/* Back Button */}
        <button
          type="button"
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          onClick={goback}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default AddSection;
