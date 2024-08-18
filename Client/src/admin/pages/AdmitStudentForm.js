import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdmitStudentForm = () => {
  const [formData, setFormData] = useState({
    admissionnumber: '',
    registrationid: '',
    joiningdate: '',
    firstname: '',
    middlename: '',
    lastname: '',
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
    } catch (error) {
      console.error('Error admitting student:', error.response?.data || error.message);
      toast.error("an error occured")
    }
  };

  return (
    <div style={{height : '100vh', overflowY : 'scroll'}} className="container mx-auto p-5 w-full">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg ">
        <h2 className="text-2xl font-bold mb-5 text-center">Admission Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="admissionnumber"
            placeholder="Admission Number"
            value={formData.admissionnumber}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="registrationid"
            placeholder="Registration ID"
            value={formData.registrationid}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
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
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="middlename"
            placeholder="Middle Name"
            value={formData.middlename}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
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
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="number"
            name="joiningyear"
            placeholder="Joining Year"
            value={formData.joiningyear}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="quota"
            placeholder="Quota"
            value={formData.quota}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="admissiontype"
            placeholder="Admission Type"
            value={formData.admissiontype}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
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
          <input
            type="text"
            name="moa"
            placeholder="Mode Of Admission(MOA)"
            value={formData.moa}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="entrancetype"
            placeholder="Entrance Type"
            value={formData.entrancetype}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
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
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="religion"
            placeholder="Religion"
            value={formData.religion}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="caste"
            placeholder="Caste"
            value={formData.caste}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="castecategory"
            placeholder="Caste Category"
            value={formData.castecategory}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
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
