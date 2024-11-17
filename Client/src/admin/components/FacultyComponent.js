
import React from "react";
import '../admindashstyle.css';
import { Routes, Route,Outlet } from 'react-router-dom';
import '../pages/view.css';
import Welcomepage from "../pages/Welcomepage";
import { AddFaculty } from "./faculty/AddFaculty";
import FacultySidebar from "./FacultySidebar";
import BulkUploadFaculty from "./faculty/BulkUploadFaculty";
import FacultyList from "./faculty/FacultyList";
import { ViewFaculty } from "./faculty/ViewFaculty";
import { ViewFacultyComponent } from "./ViewFacultyComponent";

function FacultyComponent() {
  return (
    
    <div style={{ height : '100vh', display: 'flex', justifyContent : 'center', alignItems : 'center'}}>
        <div  style={{width : '13%',height : '100vh', display: 'flex', justifyContent : 'center', alignItems: 'center'}}>
        <FacultySidebar />
        </div>
        <div  className="overflow-y-scroll scroll-hidden downscroll"  style={{width : '87%', height : '100vh', display : 'flex' , justifyContent : 'center', alignItems: 'center'}}>
        <Routes>
          <Route path="" element={<Welcomepage/>} />
          <Route index path='addfaculty' element={<AddFaculty />} />
          <Route path='bulkuploadfaculty' element={<BulkUploadFaculty />} />
          <Route path='viewfaculty/*' element={<ViewFacultyComponent />} />
        </Routes>
        
        <Outlet />
        </div>
    </div>
  );
}

export default FacultyComponent;