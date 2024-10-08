import React, { useState, useEffect } from "react";
import "../admindashstyle.css";
import { IoEye } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import './view.css'
import { FaUserEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function Viewstudentsdata() {
  const [studentsarray, Setstudentsarray] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    const admintoken = Cookies.get('admintoken');
    try {
      const response = await axios.get('http://localhost:3001/admin/allstudents', {
        headers: {
          'Authorization': `${admintoken}`
        }
      });
      if (response && response.data) {
        Setstudentsarray(response.data);
      } else {
        console.error('Unexpected response structure', response);
        toast.error('Unexpected response structure');
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDetails = (index) => {
    const jntuno = studentsarray[index].jntuno;
    navigate(`/admin/studentsdata/viewstudents/${jntuno}`);
  };

  const handleUpdate = (index) => {
    const jntuno = studentsarray[index].jntuno;
    navigate(`/admin/studentsdata/updatestudent/${jntuno}`);
  };

  const handleDelete = (index) => {
    const jntuno = studentsarray[index].jntuno;
    navigate(`/admin/studentsdata/deletestudent/${jntuno}`);
  };

  return (
    <div style={{ width: '97%', height: '94vh', borderRadius: '6px' }} className="overflow-y-scroll scroll-hidden downscroll">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-cyan-200 h-12 w-12"></div>
        </div>
      ) : (
        <table style={{ width: '100%' }} className="bg-white border border-gray-200">
          <thead style={{ background: '#1A2438', color: 'white' }}>
            <tr className="text-left border-b">
              <th className="py-3 px-4">S.No</th>
              <th className="py-3 px-4">JNTU No.</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">View</th>
              <th className="py-3 px-4">Edit</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {studentsarray.map((item, index) => (
              <tr key={item["s.no"]} className="border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td style={{ textTransform: 'uppercase' }} className="py-3 px-4">{item.jntuno}</td>
                <td style={{ textTransform: 'capitalize' }} className="py-3 px-4">{item.firstname} {item.lastname}</td>
                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">
                  <img src={item.imageurl} alt="Profile" className="w-10 h-10 rounded-full" />
                </td>
                <td className="py-3 px-6">
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => handleDetails(index)}>
                    <IoEye />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="text-black-500 hover:text-blue-700" onClick={() => handleUpdate(index)}><FaUserEdit /></button>
                </td>
                <td className="py-3 px-4">
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}><AiTwotoneDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Viewstudentsdata;
