import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import FacultyList from './faculty/FacultyList';
import { EditFaculty } from './faculty/EditFaculty';
import { FacultyViewComponent } from './faculty/FacultyViewComponent';

export const ViewFacultyComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<FacultyList />} />
        <Route path="view/:facultycode/*" element={<FacultyViewComponent />} />
        <Route path="edit/:facultycode" element={<EditFaculty />} />
      </Routes>
      <Outlet />
    </div>
  )
}

