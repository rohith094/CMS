import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const SectionList = () => {
  const { branchcode } = useParams(); // Fetch branchcode from URL params
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate();

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Fetch all active semesters
  const fetchSemesters = async () => {
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('http://localhost:3001/admin/activesemesters', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  // Fetch sections based on selected branch and semester
  const handleSemesterChange = async (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setSections([]);
    fetchSections(branchcode, semester); // Call function to fetch sections
  };

  // Fetch sections from the backend for a given branch and semester
  const fetchSections = async (branchcode, semester) => {
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get(`http://localhost:3001/admin/section/${branchcode}/${semester}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.data.length === 0) {
        console.log('No sections found for this branch and semester.');
      }
      console.log(response.data);
      setSections(response.data); // Set the fetched sections in state
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    navigate('addsection');
    // console.log('navigated');  
  };

  console.log(branchcode);


  return (
    <div className="p-4">
      <h3 className="text-center text-3xl mb-4">Sections for Branch: {branchcode}</h3>
      
      {/* Semester dropdown */}
      <div className="mb-4 flex justify-between">
      <div>
        <label htmlFor="semester" className="mr-2">Select Semester:</label>
        <select
          id="semester"
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="p-2 border"
        >
          <option value="">-- Select Semester --</option>
          {semesters.map((semester) => (
            <option key={semester.semesternumber} value={semester.semesternumber}>
              {semester.semesternumber}
            </option>
          ))}
        </select>
      </div>

        {/* Add Section Button */}

        <button
          onClick={handleAddSection}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Section
        </button>
      </div>

      {/* Display loading spinner or sections */}
      {loading ? (
        <div className="text-center">Loading sections...</div>
      ) : (
        <div>
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.sectionid} className="p-2 mb-2 rounded bg-gray-200">
                <p><strong>Section Name:</strong> {section.sectionname}</p>
                <p><strong>Section Code:</strong> {section.sectioncode}</p>
                <p><strong>Section Strength:</strong> {section.sectionstrength}</p>
              </div>
            ))
          ) : (
            <p>No sections found for the selected semester.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionList;
