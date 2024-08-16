import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sections from './Sections';
import AddSection from './sections/AddSection';
import EditSection from './sections/EditSection';

const SectionComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Sections />} />
        <Route path="addsection" element={<AddSection />} />
        <Route path="editsection/:sectionID" element={<EditSection />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default SectionComponent;
