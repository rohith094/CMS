import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import SectionList from './sections/SectionList';
import AddSection from './sections/AddSection';
import Sections from './Sections';
import SectionStudents from './sections/SectionStudents';
import MapStudents from './sections/MapStudents';
const SectionComponent = () => {
  return (
    <div>
    
      <Routes>
        <Route path="" element={<SectionList />} />
        <Route path="addsection" element={<AddSection />} />
        <Route path=":sectioncode" element={<SectionStudents />} />
        <Route path=":sectioncode/mapstudents" element={<MapStudents />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default SectionComponent;
