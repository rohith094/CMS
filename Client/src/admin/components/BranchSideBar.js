import React from 'react';
import { IoPersonAddSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { FaDownload } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useParams } from 'react-router-dom';
import { GrDocumentUpdate } from "react-icons/gr";
import { FaEdit } from 'react-icons/fa';

const IconButton = ({ icon: Icon, tooltip }) => (
  <div className="relative group">
    <button style={{background : "#415A77"}} className="w-12 h-12 mb-4 flex items-center justify-center  text-white rounded-full hover:bg-blue-700 focus:outline-none">
      <Icon className="text-xl" />
    </button>
    <span style={{background : "#6881A1" }} className="absolute z-50 left-12 top-2/3 transform -translate-y-1/2 ml-2 w-max  text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {tooltip}
    </span>
  </div>
);


const BranchSideBar = () => {
  const {branchcode} = useParams();
  console.log(branchcode);
  return (
  <div className="w-60px flex flex-col items-center justify-start pt-4 ml-10">
  <NavLink to={`/admin/branch/${branchcode}`}>
    <IconButton icon={LuLayoutDashboard} tooltip="Dashboard" />
  </NavLink>
  <NavLink to='addcourse'>
    <IconButton icon={IoPersonAddSharp} tooltip="Add Course" />
  </NavLink>
  <NavLink to='viewcourses'>
    <IconButton icon={ImProfile} tooltip="View Courses" />
  </NavLink>
  <NavLink to='bulkuploadcourses'>
    <IconButton icon={GrDocumentUpdate} tooltip="Bulk Upload Courses" />
  </NavLink>
  <NavLink to='downloadcourses'>
    <IconButton icon={FaDownload} tooltip="downloadcourses" />
  </NavLink>
</div>
  )
};

export default BranchSideBar;
