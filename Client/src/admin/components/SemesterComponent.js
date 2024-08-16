import React from 'react'
import { Routes, Route,Outlet } from 'react-router-dom';
import Semesters from './Semesters';
import AddSemester from './semesters/AddSemester';
import EditSemester from './semesters/EditSemester';
const SemesterComponent = () => {
  return (
    <div >
        
        
        <Routes>
          <Route path="" element={<Semesters />} />
          
          <Route path="addsemester" element={<AddSemester />} />
          <Route path="editsemester/:semesterID" element={<EditSemester />} />
        </Routes>
        
        <Outlet />
      
    </div>
  )
}

export default SemesterComponent
