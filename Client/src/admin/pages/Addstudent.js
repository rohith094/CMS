import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import './view.css'
import { useNavigate } from 'react-router-dom';
const Addstudent = () => {
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true); // Set loading to true
      // Get the admin token from the cookies
      const admintoken = Cookies.get('admintoken');
      try {
        const response = await axios.post("http://localhost:3001/admin/addstudent", {
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
          toast.success('Student added successfully');

        }

      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.error('A student with the same email or JNTU number already exists');
        } else {
          toast.error('Error adding student');
        }
      } finally {
        setLoading(false);
        navigate('/admin/studentsdata'); // Set loading to false
      }
    }
  };

  const handleBack = ()=>{
    navigate('/admin/studentsdata');
  }

  return (
    <div style={{width:"100%", height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}} className=" px-6 ">
      <div style={{width:"100%" ,height:"90%",overflowY:"scroll",display:"flex",flexDirection:"column"}} className="flex flex-colm-6  p-8 border  rounded-lg shadow-lg downscroll ">
        <h2 style={{fontSize : '2rem', fontWeight : 'bold', color : '#1A2438'}} className="text-center text-2xl mb-4">Add Student</h2>
        <form  onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="jntuno"
              placeholder="JNTU No"
              value={student.jntuno}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
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
            style={{background:"#1A2438"}}
            className={`p-2 text-white rounded-md w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Student...
              </div>
            ) : (
              'Add Student'
            )}
          </button>
          <button
          style={{width : '100%'}}
          onClick={handleBack}
          className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
        </form>
      </div>
    </div>
  );
};

export default Addstudent;