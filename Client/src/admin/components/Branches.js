import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleEdit = (branchID) => {
    navigate(`editbranch/${branchID}`);
  };

  const handleDelete = async (branchID) => {
    try {
      const token = Cookies.get('admintoken');
      await axios.delete(`http://localhost:3001/admin/branch/${branchID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  return (
    <div className='p-2'>
      <header className="flex justify-between items-center p-4">
        <h3 className='text-center text-4xl mb-4 ml-2'>Branches</h3>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('addbranch')}
        >
          Add Branch
        </button>
      </header>
      <div style={{ width: "97%" }} className="p-4">
        {loading ? (
          <div className="text-center">Loading branches...</div>
        ) : (
          branches.map((branch) => (
            <>
            <Link to={`/admin/branch/${branch.branchcode}`}>
            <div
              key={branch.BranchID}
              className="p-2 mb-2 rounded bg-gray-200"
            >
              <div className="flex justify-between items-center p-2">
                <p className='text-xl mr-4'>{branch.branchname}</p>
              </div>
              <div className="p-2">
                <p>{branch.branchcode}</p>
                <p>HOD: {branch.hodname}</p>
                <p>Block Number: {branch.blocknumber}</p>
              </div>
            </div>
            </Link>
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default Branches;
