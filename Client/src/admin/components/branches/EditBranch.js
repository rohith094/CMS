import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const EditBranch = () => {
  const { branchID} = useParams(); 
  console.log(branchID);
  
  const navigate = useNavigate(); 
  const goback = ()=>{
    navigate('/admin/branches')
  }


  const [formData, setFormData] = useState({
    BranchName: '',
    HodName: '',
    BlockNumber: ''
  });

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const token = Cookies.get('admintoken');
        const response = await axios.get(`http://localhost:3001/admin/branch/${branchID}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFormData({
          BranchName: response.data.BranchName,
          HodName: response.data.HodName,
          BlockNumber: response.data.BlockNumber,
        });
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    };

    fetchBranchData();
  }, [branchID]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditBranch = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('admintoken');
      await axios.put(
        `http://localhost:3001/admin/branch/${branchID}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      navigate('/admin/branches'); // Navigate to /admin/branches after editing a branch
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleEditBranch} className="bg-white p-8 rounded-lg  w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Branch</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Name:</label>
          <input
            type="text"
            name="BranchName"
            value={formData.BranchName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Head of Department Name:</label>
          <input
            type="text"
            name="HodName"
            value={formData.HodName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Block Number:</label>
          <input
            type="text"
            name="BlockNumber"
            value={formData.BlockNumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Update Branch
        </button>
        <button 
          className=' mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center'
          onClick={()=>goback()}
          >
            Back
          </button>
      </form>
    </div>
  );
};

export default EditBranch;
