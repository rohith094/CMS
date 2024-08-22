import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import './view.css';
import { useNavigate } from 'react-router-dom';
const AdmitStudentForm = () => {

  const [branches, setBranches] = useState([]);
  const year = new Date().getFullYear();
  const navigate = useNavigate();


  const statesInIndia = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Ladakh',
    'Jammu and Kashmir'
  ];

  useEffect(() => {
    const fetchBranches = async () => {
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
      }
    };
    fetchBranches();
  }, []);

  const [formData, setFormData] = useState({
    joiningdate: '',
    nameasperssc: '',
    studentaadhar: '',
    mobile: '',
    alternatemobile: '',
    personalemail: '',
    gender: '',
    dob: '',
    branch: '',
    joiningyear: '',
    quota: '',
    admissiontype: '',
    fathername: '',
    mothername: '',
    fatheraadhar: '',
    motheraadhar: '',
    scholarshipholder: '',
    presentaddress: '',
    presentpincode: '',
    currentaddress: '',
    currentpincode: '',
    moa: '',
    remarks: '',
    entrancetype: '',
    entrancehallticket: '',
    rank: '',
    city: '',
    state: '',
    nationality: '',
    religion: '',
    caste: '',
    castecategory: ''
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const admintoken = Cookies.get('admintoken');
      const response = await axios.post('http://localhost:3001/admin/admitstudent', formData, {
        headers: {
          Authorization: `${admintoken}`
        }
      });
      console.log('Student admitted successfully:', response.data);
      toast.success("student added succesfully");
      // navigate('/admin/studentsdata');

    } catch (error) {
      console.error('Error admitting student:', error.response?.data || error.message);
      toast.error("an error occured")
    }
  };

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }} className="container mx-auto p-5 w-full downscroll">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg ">
        <h2 className="text-2xl font-bold mb-5 text-center">Admission Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="p-3 border rounded w-full bg-black text-white" >Joining date </label>
          <input
            type="date"
            name="joiningdate"
            placeholder="Joining Date"
            value={formData.joiningdate}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="nameasperssc"
            placeholder="Fullname as per SSC"
            value={formData.nameasperssc}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="studentaadhar"
            placeholder="Student Aadhar"
            value={formData.studentaadhar}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="alternatemobile"
            placeholder="Alternate Mobile Number"
            value={formData.alternatemobile}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="email"
            name="personalemail"
            placeholder="Personal Email"
            value={formData.personalemail}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label className="p-3 border rounded w-full bg-black text-white">Date Of Birth</label>
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="branch"
            value={formData.branchcode}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branchcode} value={branch.branchcode}>
                {branch.branchname}
              </option>
            ))}
          </select>
          <select
            name="joiningyear"
            value={formData.joiningyear}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select year</option>
            <option value={year - 2}>{year - 2}</option>
            <option value={year - 1}>{year - 1}</option>
            <option value={year}>{year}</option>
            <option value={year + 1}>{year + 1}</option>
            <option value={year + 2}>{year + 2}</option>
          </select>
          <select
            name="quota"
            value={formData.quota}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select quota</option>
            <option value="convenor">Convenor</option>
            <option value="management">Management</option>
            <option value="lateral">Lateral</option>
          </select>
          <select
            name="admissiontype"
            value={formData.admissiontype}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Admission Type</option>
            <option value="general">General</option>
            <option value="management">Management</option>
            <option value="lateral">Lateral Entry</option>
          </select>
          <input
            type="text"
            name="fathername"
            placeholder="Father's Name"
            value={formData.fathername}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="mothername"
            placeholder="Mother's Name"
            value={formData.mothername}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="fatheraadhar"
            placeholder="Father's Aadhar"
            value={formData.fatheraadhar}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="motheraadhar"
            placeholder="Mother's Aadhar"
            value={formData.motheraadhar}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <select
            name="scholarshipholder"
            value={formData.scholarshipholder}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Scholarship Holder</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <textarea
            name="presentaddress"
            placeholder="Present Address"
            value={formData.presentaddress}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="presentpincode"
            placeholder="Present Pincode"
            value={formData.presentpincode}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <textarea
            name="currentaddress"
            placeholder="Current Address"
            value={formData.currentaddress}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="currentpincode"
            placeholder="Current Pincode"
            value={formData.currentpincode}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="moa"
            value={formData.moa}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select mode of admission</option>
            <option value="convenor">Convenor</option>
            <option value="management">Management</option>
            <option value="lateral">Lateral</option>
            <option value="convenorspot">Convenor Spot</option>
            <option value="managementspot">Management Spot</option>
            <option value="lateralspot">Lateral Spot</option>
          </select>
          <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />

          <select
            name="entrancetype"
            value={formData.entrancetype}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Entrance type</option>
            <option value="eamcet">EAMCET</option>
            <option value="ecet">ECET</option>
            <option value="pgecet">PGECET</option>
            <option value="gate">GATE</option>
          </select>
          <input
            type="text"
            name="entrancehallticket"
            placeholder="Entrance Hall Ticket"
            value={formData.entrancehallticket}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="rank"
            placeholder="Rank"
            value={formData.rank}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select state</option>
            {statesInIndia.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Religion</option>
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="christian">Christian</option>
          </select>
          <input
            type="text"
            name="caste"
            placeholder="Caste"
            value={formData.caste}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <select
            name="castecategory"
            value={formData.castecategory} 
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Castecategory</option>
            <option value="oc">OC</option>
            <option value="bcd">BC-D</option>
            <option value="bcb">BC-B</option>
            <option value="bcc">BC-C</option>
            <option value="bca">BC-A</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
          >
            Admit Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmitStudentForm;
