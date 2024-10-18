import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import SectionList from './sections/SectionList';
import AddSection from './sections/AddSection';
import Sections from './Sections';
const SectionComponent = () => {
  return (
    <div>
    
      <Routes>
        <Route path="" element={<SectionList />} />
        <Route path="addsection" element={<AddSection />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default SectionComponent;
