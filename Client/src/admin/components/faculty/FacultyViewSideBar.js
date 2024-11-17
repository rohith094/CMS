import React from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router-dom';

const IconButton = ({ icon: Icon, tooltip }) => (
  <div className="relative group flex flex-col items-center">
    <button 
      style={{background: "#415A77"}} 
      className="w-12 h-12 mb-2 flex items-center justify-center text-white rounded-full hover:bg-blue-700 focus:outline-none"
    >
      <Icon className="text-xl" />
    </button>
    <span 
      style={{background: "#6881A1"}} 
      className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {tooltip}
    </span>
  </div>
);

const FacultyViewSidebar = () => (
  <div className="w-60 flex items-start pt-4">
    <NavLink to="" className="m-3">
      <IconButton icon={CgProfile } tooltip="Profile" />
    </NavLink>
    <NavLink to="dashboard" className="m-3">
      <IconButton icon={LuLayoutDashboard} tooltip="Dashboard" />
    </NavLink>
    {/* Add more NavLinks as needed */}
    <NavLink to="" className="m-3">
      <IconButton icon={LuLayoutDashboard} tooltip="Dashboard" />
    </NavLink>
    <NavLink to="" className="m-3">
      <IconButton icon={LuLayoutDashboard} tooltip="Dashboard" />
    </NavLink>
  </div>
);

export default FacultyViewSidebar;
