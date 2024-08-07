import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import './view.css';

const UpdateStudent = () => {
  const { jntuno } = useParams();

  const [student, setStudent] = useState({
    jntuno: '',
    email: '',
    firstname: '',
    lastname: '',
    branch: '',
    joiningyear: '',
    currentyear: '',
    imageurl: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const admintoken = Cookies.get('admintoken');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/singlestudent/${jntuno}`,{
          headers: {
            'Authorization': `${admintoken}`
          }
        });
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Error fetching student data');
      }
    };

    fetchStudent();
  }, [jntuno]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({
      ...student,
      [name]: value
    });
  };

  const validate = () => {
    let errors = {};
    
    if (!student.jntuno) {
      errors.jntuno = "JNTU No is required";
    }
    if (!student.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(student.email)) {
      errors.email = "Email address is invalid";
    }
    if (!student.firstname) {
      errors.firstname = "First Name is required";
    }
    if (!student.lastname) {
      errors.lastname = "Last Name is required";
    }
    if (student.branch === 'select' || !student.branch) {
      errors.branch = "Branch is required";
    }
    if (!student.joiningyear) {
      errors.joiningyear = "Joining Year is required";
    } else if (student.joiningyear < 2000 || student.joiningyear > new Date().getFullYear()) {
      errors.joiningyear = "Joining Year is invalid";
    }
    if (!student.currentyear) {
      errors.currentyear = "Current Year is required";
    } else if (student.currentyear < 1 || student.currentyear > 4) {
      errors.currentyear = "Current Year is invalid";
    }
    if (!student.imageurl) {
      errors.imageurl = "Image URL is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put("http://localhost:3001/admin/updatestudent", {
          jntuno: student.jntuno,
          email: student.email,
          fname: student.firstname,
          lname: student.lastname,
          branch: student.branch,
          jyear: student.joiningyear,
          cyear: student.currentyear,
          imageurl: student.imageurl
        }, {
          headers: {
            'Authorization': `${admintoken}`
          }
        });

        if (response.status === 200) {
          toast.success('Student updated successfully');
          // history.push('/students'); // Navigate to students list or another relevant page
          navigate('/admin/studentsdata/viewstudents');
        }

      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error('Student not found');
        } else {
          toast.error('Error updating student');
        }
      }
    }
  };

  const handleBack = ()=>{
    navigate('/admin/studentsdata/viewstudents');
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} className="px-6">
      <div style={{ width: "100%", height: "90%", overflowY: "scroll", display: "flex", flexDirection: "column" }} className="flex flex-colm-6 p-8 border rounded-lg shadow-lg downscroll">
        <h2 className="text-center text-2xl mb-4">Update Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="jntuno"
              placeholder="JNTU No"
              value={student.jntuno}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              disabled
            />
            {errors.jntuno && <p className="text-red-500 text-sm mt-1">{errors.jntuno}</p>}
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={student.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={student.firstname}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={student.lastname}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
          </div>
          <div className="mb-3">
            <select
              name="branch"
              value={student.branch}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="select">Select</option>
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="AIDS">AIDS</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="BSH">BSH</option>
              <option value="CHEM">CHEM</option>
            </select>
            {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="joiningyear"
              placeholder="Joining Year"
              value={student.joiningyear}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.joiningyear && <p className="text-red-500 text-sm mt-1">{errors.joiningyear}</p>}
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="currentyear"
              placeholder="Current Year"
              value={student.currentyear}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.currentyear && <p className="text-red-500 text-sm mt-1">{errors.currentyear}</p>}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="imageurl"
              placeholder="Image URL"
              value={student.imageurl}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.imageurl && <p className="text-red-500 text-sm mt-1">{errors.imageurl}</p>}
          </div>
          <button
            type="submit"
            style={{ background: "#1A2438" }}
            className="p-2 text-white rounded-md w-full"
          >
            Update Student
          </button>
          <button
          onClick={handleBack}
            type="submit"
            style={{ background: "#1A2438" }}
            className="mt-4 p-2 text-white rounded-md w-full"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudent;
