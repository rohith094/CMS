import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false); // Track overall loading state
  const [loadingSemester, setLoadingSemester] = useState(null); // Track loading for specific semester
  const navigate = useNavigate();

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true); // Set loading to true when fetching begins
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('http://localhost:3001/admin/viewsemesters', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  };

  const handleEdit = (semesterID) => {
    navigate(`editsemester/${semesterID}`);
  };

  const handleDelete = async (semesterID) => {
    try {
      const token = Cookies.get('admintoken');
      await axios.delete(`http://localhost:3001/admin/deletesemester/${semesterID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchSemesters();
    } catch (error) {
      console.error('Error deleting semester:', error);
    }
  };

  const toggleActive = async (semesterID, currentStatus) => {
    setLoadingSemester(semesterID); // Set loading state for this semester
    try {
      const token = Cookies.get('admintoken');
      await axios.put(`
        http://localhost:3001/admin/managesemester/${semesterID}`,
        { SemesterActive: !currentStatus },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchSemesters();
    } catch (error) {
      console.error('Error toggling semester status:', error);
    } finally {
      setLoadingSemester(null); // Reset loading state
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  return (
    <div className='p-2'>
      <header className="flex justify-between items-center p-4">
        <h3 className='text-center text-4xl mb-4 ml-2'>Semesters</h3>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('addsemester')}
        >
          Add Semester
        </button>
      </header>
      <div style={{ width: "80%", display: 'flex', paddingLeft: "2%", columnGap: "5%" }} className='p-2 m-2'>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", columnGap: "8px" }}>
          <p style={{ fontSize: "19px" }}>Active</p>
          <div style={{ width: "10px", height: "10px", background: "green", borderRadius: "100%" }}></div>
        </div>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", columnGap: "8px" }}>
          <p style={{ fontSize: "19px" }}>Deactive</p>
          <div style={{ width: "10px", height: "10px", background: "red", borderRadius: "100%" }}></div>
        </div>
      </div>
      <div style={{ width: "97%" }} className="p-4">
        {loading ? ( // Display loading indicator if semesters are being fetched
          <div className="text-center">Loading semesters...</div>
        ) : (
          semesters.map((semester) => (
            <div
              key={semester.SemesterID}
              className={`p-2 mb-2 rounded ${semester.SemesterActive ? 'bg-green-300' : 'bg-red-300'}`}
            >
              <div className="flex justify-between items-center p-2">
                <p className='text-xl mr-4'>Semester {semester.SemesterNumber}</p>
                <div className='flex items-center justify-center'>
                  <p style={{ fontSize: "15px" }}>{formatDate(semester.StartDate)} -</p>
                  <p style={{ fontSize: "15px" }}>{formatDate(semester.EndDate)}</p>
                </div>
                <div className='flex justify-center gap-x-4 items-center'>
                  <FaRegEdit className='cursor-pointer text-cyan-900 text-xl mr-2' onClick={() => handleEdit(semester.SemesterID)} />
                  <MdOutlineDeleteOutline className='cursor-pointer text-cyan-900 text-xl mr-2' onClick={() => handleDelete(semester.SemesterID)} />
                  <button
                    
                    className={`bg-${semester.SemesterActive ? 'blue' : 'blue'}-500 hover:bg-${
                      semester.SemesterActive ? 'blue' : 'blue'
                    }-700 text-white w-28 py-2 px-4 rounded`}
                    onClick={() => toggleActive(semester.SemesterID, semester.SemesterActive)}
                    disabled={loadingSemester === semester.SemesterID} // Disable button while loading
                  >
                    {loadingSemester === semester.SemesterID ? 'Loading...' : semester.SemesterActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Semesters;