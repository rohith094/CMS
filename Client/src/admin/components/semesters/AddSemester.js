import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const AddSemester = () => {
  const [semesterNumber, setSemesterNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [semesterActive, setSemesterActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const goback = ()=>{
    navigate('/admin/semesters')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const token = Cookies.get('admintoken');
      await axios.post(
        'http://localhost:3001/admin/addsemester',
        {
          SemesterNumber: semesterNumber,
          StartDate: startDate,
          EndDate: endDate,
          SemesterActive: semesterActive,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      navigate('/admin/semesters');
    } catch (error) {
      console.error('Error adding semester:', error);
    } finally {
      setLoading(false); // Set loading to false after request is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-white p-8 rounded">
        <h1 className="text-2xl font-bold text-center mb-6">Add Semester</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Semester Number:</label>
            <input
              type="number"
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
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
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Add Semester'
            )}
          </button>

          <button 
          className='w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center'
          onClick={()=>goback()}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSemester;
