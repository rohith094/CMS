import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true);
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
      setLoading(false);
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
        {loading ? (
          <div className="text-center">Loading semesters...</div>
        ) : (
          semesters.map((semester) => (
            <Link to={`/admin/semesters/${semester.semesternumber}`}>
              <div
                key={semester.semesterid}
                className={`p-2 mb-2 rounded ${semester.semesteractive ? 'bg-green-300' : 'bg-red-300'}`}
              >
                <div className="flex justify-between items-center p-2">
                  <p className='text-xl mr-4'>{semester.semestername} :   {semester.batchyear} - {semester.batchyear + 4}</p>
                  <div className='flex items-center justify-center'>
                    <p style={{ fontSize: "15px" }}>{formatDate(semester.startdate)}</p>
                    <p style={{ fontSize: "15px" }}>-{formatDate(semester.enddate)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Semesters;
