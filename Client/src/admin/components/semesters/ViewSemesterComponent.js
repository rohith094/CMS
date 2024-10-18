import React from 'react'
import ViewSemester from './ViewSemester'
import EditSemester from './EditSemester'
import { Routes, Route,Outlet } from 'react-router-dom';
import PromoteStudents from './PromoteStudents';
const ViewSemesterComponent = () => {
  return (
    <div>
       <Routes>
          <Route path="" element={<ViewSemester/>} />
          <Route path="editsemester" element={<EditSemester/>} />
          <Route path="promotestudents" element={<PromoteStudents/>}/>
        </Routes>
        
        <Outlet />
    </div>
  )
}

export default ViewSemesterComponent

