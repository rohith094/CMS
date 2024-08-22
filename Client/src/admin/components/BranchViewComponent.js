import React from 'react'
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import AddCourse from './courses/AddCourse';

const BranchViewComponent = () => {
  return (
    <div>
      <Link to="addcourse">Add Course</Link>

      <Routes>
          <Route path="addcourse" element={<AddCourse />} />
      </Routes>
        
        <Outlet />
    </div>
  )
}

export default BranchViewComponent;
