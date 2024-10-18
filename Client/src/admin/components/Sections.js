import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddSection from './sections/AddSection';

const Sections = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for redirection

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('http://localhost:3001/admin/branches', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to Add Section page
  // const handleAddSection = () => {
  //   navigate('addsection');
  //   // console.log('navigated');
  // };

  return (
    <div className="p-2">
      <header className="flex justify-between items-center p-4">
        <h3 className="text-center text-4xl mb-4 ml-2">Sections by Branch</h3>
      </header>

      <div style={{ width: "97%" }} className="p-4">
        {loading ? (
          <div className="text-center">Loading branches...</div>
        ) : (
          branches.map((branch) => (
            <Link to={`/admin/sections/${branch.branchcode}`} key={branch.branchcode}>
              <div className="p-2 mb-2 rounded bg-gray-200">
                <div className="flex justify-between items-center p-2">
                  <p className="text-xl mr-4">{branch.branchname}</p>
                </div>
                <div className="p-2">
                  <p>{branch.branchcode}</p>
                  <p>HOD: {branch.hodname}</p>
                  <p>Block Number: {branch.blocknumber}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Sections;
