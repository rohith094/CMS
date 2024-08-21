import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBranch = () => {
  const [formData, setFormData] = useState({
    branchcode: '',
    branchname: '',
    hodname: '',
    blocknumber: '',
    branchshortcut: ''
  });

  const navigate = useNavigate(); 

  const goback = () => {
    navigate('/admin/branches');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('admintoken');
      await axios.post(
        'http://localhost:3001/admin/addbranch',
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setFormData({
        branchcode: '',
        branchname: '',
        hodname: '',
        blocknumber: '',
        branchshortcut: ''
      }); 
      navigate('/admin/branches'); 
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleAddBranch} className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Branch</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Code:</label>
          <input
            type="text"
            name="branchcode"
            value={formData.branchcode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Name:</label>
          <input
            type="text"
            name="branchname"
            value={formData.branchname}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Head of Department Name:</label>
          <input
            type="text"
            name="hodname"
            value={formData.hodname}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Block Number:</label>
          <input
            type="number"
            name="blocknumber"
            value={formData.blocknumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Branch Shortcut:</label>
          <input
            type="text"
            name="branchshortcut"
            value={formData.branchshortcut}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Add Branch
        </button>

        <button 
          type="button"
          className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          onClick={goback}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default AddBranch;
