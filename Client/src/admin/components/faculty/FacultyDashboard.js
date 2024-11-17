import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get('admintoken');
  const { facultycode } = useParams();

  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week').add(1, 'day'));
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [semesternumber, setSelectedSemester] = useState(null);
  const [branchcode, setSelectedBranch] = useState(null);

  const hours = Array.from({ length: 12 }, (_, i) => `${7 + i}:00 AM`);
  hours[5] = '12:00 PM';
  hours.splice(6, 6, ...Array.from({ length: 6 }, (_, i) => `${i + 1}:00 PM`));

  useEffect(() => {
    fetchActiveSemesters();
    fetchBranches();
    if (semesternumber && branchcode) {
      fetchClasses();
    }
  }, [currentWeek, semesternumber, branchcode]);

  const fetchActiveSemesters = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/activesemesters', {
        headers: { Authorization: `${token}` }
      });
      setSemesterOptions(response.data);
    } catch (error) {
      console.error('Error fetching active semesters:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/branches', {
        headers: { Authorization: `${token}` }
      });
      setBranchOptions(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/admin/facultyclasses`,
        {
          params: {
            facultycode,
            semesternumber,
            branchcode
          },
          headers: { Authorization: `${token}` }
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
    setLoading(false);
  };

  const handleAddSchedule = () => {
    if (semesternumber && branchcode) {
      navigate(`/admin/facultycomponent/viewfaculty/view/${facultycode}/${semesternumber}/${branchcode}/addschedule`);
    }
  };
  const renderCells = (dayIdx) => {
    const day = currentWeek.add(dayIdx, 'day');
    return hours.map((hour, idx) => {
      const matchingClass = classes.find((classItem) => {
        // Extract day from scheduledate and match with the class's 'day' field
        const classDay = dayjs(classItem.scheduledate).format('dddd'); // Get day from scheduledate
        const formattedStartTime = dayjs(`2024-01-01T${classItem.starttime}`).format('h:mm A'); // Convert starttime to a comparable format
        const classDate = dayjs(classItem.scheduledate).format('YYYY-MM-DD'); // Extract date (without time)

        // Compare the exact date and the formatted start time
        return classDay === day.format('dddd') &&
               formattedStartTime === hour &&
               classDate === day.format('YYYY-MM-DD'); // Compare with the current day's date in the week
      });

      return (
        <div
          key={idx}
          className={`border border-gray-200 p-2 text-center text-sm ${matchingClass ? 'bg-green-500 text-white' : ''}`}
        >
          {matchingClass ? (
            <div className="p-1 rounded-md">
              <div>{matchingClass.sectioncode}</div>
              <div>{matchingClass.coursecode}</div>
            </div>
          ) : (
            <div>No Class</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
      
        <button
          onClick={() => setCurrentWeek(currentWeek.subtract(7, 'day'))}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          {loading ? <ClipLoader size={20} color="white" /> : <FiChevronLeft size={20} />}
          <span className="ml-2">Previous Week</span>
        </button>

        <h2 className="text-lg font-semibold text-gray-700">
          Week of {currentWeek.format('MMM DD, YYYY')}
        </h2>

        <button
          onClick={() => setCurrentWeek(currentWeek.add(7, 'day'))}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          <span className="mr-2">Next Week</span>
          {loading ? <ClipLoader size={20} color="white" /> : <FiChevronRight size={20} />}
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <select
          value={semesternumber || ''}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="" disabled>Select Semester</option>
          {semesterOptions.map((semester) => (
            <option key={semester.semesterid} value={semester.semesternumber}>
              {semester.semesternumber}
            </option>
          ))}
        </select>

        <select
          value={branchcode || ''}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="" disabled>Select Branch</option>
          {branchOptions.map((branch) => (
            <option key={branch.branchcode} value={branch.branchcode}>
              {branch.branchshortcut}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddSchedule}
          disabled={!semesternumber || !branchcode}
          className={`px-4 py-2 text-white rounded-md transition duration-200 ${
            !semesternumber || !branchcode ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
        Add Schedule
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1 bg-white border rounded-md shadow-md overflow-hidden">
        <div className="bg-gray-200 p-2 font-bold text-center">Time</div>
        {Array.from({ length: 7 }).map((_, idx) => {
          const day = currentWeek.add(idx, 'day');
          return (
            <div key={idx} className="bg-gray-200 p-2 font-bold text-center">
              <div>{day.format('dddd')}</div>
              <div className="text-sm text-gray-600">{day.format('MMM DD')}</div>
            </div>
          );
        })}

        {hours.map((hour, hourIdx) => (
          <React.Fragment key={hourIdx}>
            <div className="bg-gray-100 p-2 font-semibold text-center">{hour}</div>
            {Array.from({ length: 7 }).map((_, dayIdx) => (
              <div key={dayIdx} className="border border-gray-200 p-2 h-16 text-center">
                {loading ? <ClipLoader size={20} color="#3B82F6" /> : renderCells(dayIdx)[hourIdx]}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;
