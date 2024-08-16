import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSection, setLoadingSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('http://localhost:3001/admin/sections', {
        headers: {
          Authorization: `${token}`,
        },
      });
      // Directly set sections with branch and semester details
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(sections);
  const handleEdit = (sectionID) => {
    navigate(`editsection/${sectionID}`);
  };

  const handleDelete = async (sectionID) => {
    setLoadingSection(sectionID);
    try {
      const token = Cookies.get('admintoken');
      await axios.delete(`http://localhost:3001/admin/deletesection/${sectionID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className='p-2'>
      <header className="flex justify-between items-center p-4">
        <h3 className='text-center text-4xl mb-4 ml-2'>Sections</h3>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('addsection')}
        >
          Add Section
        </button>
      </header>
      <div style={{ width: "97%" }} className="p-4">
        {loading ? (
          <div className="text-center">Loading sections...</div>
        ) : (
          sections.map((section) => (
            <div
              key={section.SectionID}
              className="p-2 mb-2 rounded bg-gray-200"
            >
              <div className="flex justify-between items-center p-2">
                <div className="flex flex-col">
                  <p className='text-xl mr-4'>{section.SectionName}</p>
                  <p className='text-lg'>Branch: {section.BranchName}</p>
                  <p className='text-lg'>Semester: {section.SemesterNumber}</p>
                </div>
                <div className='flex justify-center gap-x-4 items-center'>
                  <FaRegEdit
                    className='cursor-pointer text-cyan-900 text-xl mr-2'
                    onClick={() => handleEdit(section.SectionID)}
                  />
                  <MdOutlineDeleteOutline
                    className='cursor-pointer text-cyan-900 text-xl mr-2'
                    onClick={() => handleDelete(section.SectionID)}
                    disabled={loadingSection === section.SectionID}
                  />
                  {/* <button
                    className={`bg-red-500 hover:bg-red-700 text-white w-28 py-2 px-4 rounded ${loadingSection === section.SectionID ? 'cursor-not-allowed' : ''}`}
                    onClick={() => handleDelete(section.SectionID)}
                    disabled={loadingSection === section.SectionID}
                  >
                    {loadingSection === section.SectionID ? 'Loading...' : 'Delete'}
                  </button> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sections;
