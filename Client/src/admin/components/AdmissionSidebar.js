import React from 'react';

import { IoPersonAddSharp } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaDownload } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink } from 'react-router-dom';

const IconButton = ({ icon: Icon, tooltip }) => (
  <div className="relative group">
    <button style={{background : "#415A77"}} className="w-12 h-12 mb-4 flex items-center justify-center  text-white rounded-full hover:bg-blue-700 focus:outline-none">
      <Icon className="text-xl" />
    </button>
    <span style={{background : "#6881A1" }} className="absolute left-12 top-1/3 transform -translate-y-1/2 ml-2 w-max  text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {tooltip}
    </span>
  </div>
);

const AdmissionSidebar = () => (
  <div className="w-60px flex flex-col items-center justify-start pt-4 ml-10">
  <NavLink to='/admin/admissions'>
    <IconButton icon={LuLayoutDashboard} tooltip="Dashboard" />
  </NavLink>
  <NavLink to='addstudent'>
    <IconButton icon={IoPersonAddSharp} tooltip="Add Student" />
  </NavLink>
  <NavLink to='addstudents'>
    <IconButton icon={MdGroupAdd} tooltip="Upload Students" />
  </NavLink>
  <NavLink to='viewstudents'>
    <IconButton icon={ImProfile} tooltip="View Students" />
  </NavLink>
  <NavLink to='downloadstudents'>
    <IconButton icon={FaDownload} tooltip="Download Data" />
  </NavLink>
</div>
);

export default AdmissionSidebar;
