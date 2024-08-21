import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Courses from './Courses';
import AddCourse from './courses/AddCourse';
import EditCourse from './courses/EditCourse';


const CourseComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<Courses />} />
        <Route path="addcourse" element={<AddCourse />} />
        <Route path="editcourse/:coursecode" element={<EditCourse />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default CourseComponent;

