import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import  FacultyDashboard  from './FacultyDashboard';
import FacultyViewSidebar from './FacultyViewSideBar';
import { FacultyProfile } from './FacultyProfile';
import AddSchedule  from './AddSchedule';

export const FacultyViewComponent = () => {
  return (
    <div style={{width : '100%', height : '100vh'}}>
    <FacultyViewSidebar />
    <div className="flex flex-col">
      <div className="flex-1 ml-4"> {/* This will take the remaining width */}
        <Routes>
          <Route path="" element={<FacultyProfile />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path=":semesternumber/:branchcode/addschedule" element={<AddSchedule />} />
        </Routes>
        <Outlet />
      </div>
    </div>
    </div>
  );
};

export default FacultyViewComponent;
