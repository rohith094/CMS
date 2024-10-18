import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const EditSemester = () => {
  const { semesternumber} = useParams();
  const [semesterNumber, setSemesterNumber] = useState('');
  const [semesterName, setSemesterName] = useState(''); // Added field for semester name
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [batchYear, setBatchYear] = useState(''); // Added field for batch year
  const [semesterActive, setSemesterActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSemester();
  }, []);

  const goback = () => {
    navigate('/admin/semesters');
  };

  const fetchSemester = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get(`http://localhost:3001/admin/semester/${semesternumber}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const semester = response.data;

        if (semester.startdate && semester.enddate) {
          semester.startdate = new Date(semester.startdate).toISOString().split('T')[0];
          semester.enddate = new Date(semester.enddate).toISOString().split('T')[0];
        }
      console.log(semester);
      if (semester) {
        setSemesterNumber(semester.semesternumber);
        setSemesterName(semester.semestername);
        setStartDate(semester.startdate);
        setEndDate(semester.enddate);
        setBatchYear(semester.batchyear);
        setSemesterActive(semester.semesteractive === 1); // Assuming 1 is active
      }
    } catch (error) {
      console.error('Error fetching semester:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      await axios.put(
        `http://localhost:3001/admin/editsemester/${semesternumber}`,
        {
          semesternumber: semesterNumber,
          semestername: semesterName,
          startdate: startDate,
          enddate: endDate,
          batchyear: batchYear,
          semesteractive: semesterActive ? 1 : 0, // Convert boolean to integer
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      navigate('/admin/semesters');
    } catch (error) {
      console.error('Error updating semester:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Semester</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Semester Number:</label>
              <input
                type="number"
                value={semesternumber}
                onChange={(e) => setSemesterNumber(e.target.value)}
                className="border rounded p-2 w-full"
                disabled
              />
            </div>
            <div>
              <label className="block mb-2">Semester Name:</label>
              <input
                type="text"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Batch Year:</label>
              <input
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={semesterActive}
                onChange={() => setSemesterActive(!semesterActive)}
                className="mr-2"
              />
              <label>Active</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Update Semester'
              )}
            </button>
            <button 
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center'
              onClick={goback}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSemester;
