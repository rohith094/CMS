import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AddCurriculum from './curriculum/AddCurriculum';
import EditCurriculum from './curriculum/EditCurriculum';
import ViewCurriculum from './ViewCurriculum';

const CurriculumComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<ViewCurriculum />} />
        <Route path="addcurriculum" element={<AddCurriculum />} />
        <Route path="editcurriculum/:curriculumid" element={<EditCurriculum />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default CurriculumComponent;
