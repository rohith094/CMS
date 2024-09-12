
import React from "react";
import '../admindashstyle.css';
import Studentsidebar from "./Studentsidebar";
import { Routes, Route,Outlet } from 'react-router-dom';
import Addstudent from '../pages/Addstudent';
import Addstudents from "../pages/Addstudents";
import '../pages/view.css';
import Singlestudent from "../pages/Singlestudent";
import UpdateStudent from "../pages/UpdateStudent";
import Deletestudent from "../pages/Deletestudent";
import Welcomepage from "../pages/Welcomepage";
import StudentSearch from "../pages/StudentSearch";
import StudentDownload from "../pages/StudentDownload";
import AdmitStudentForm from "../pages/AdmitStudentForm";
import AddStudent from "./students/AddStudent";
import ViewAdmissions from "./ViewAdmissions";
function Studentcomponent() {
  

  return (
    
    <div style={{ height : '100vh', display: 'flex', justifyContent : 'center', alignItems : 'center'}}>
        <div  style={{width : '13%',height : '100vh', display: 'flex', justifyContent : 'center', alignItems: 'center'}}>
        <Studentsidebar />
        </div>
        <div  className="overflow-y-scroll scroll-hidden downscroll"  style={{width : '87%', height : '100vh', display : 'flex' , justifyContent : 'center', alignItems: 'center'}}>
        <Routes>
          <Route path="" element={<Welcomepage />} />
          <Route index path='addstudent' element={<AddStudent />} />
          <Route path="addstudents" element={<Addstudents />} />
          <Route path="viewstudents" element={<ViewAdmissions />} />
          <Route path="viewstudents/:jntuno" element={<Singlestudent />} />
          <Route path="updatestudent/:jntuno" element={<UpdateStudent />} />
          <Route path="deletestudent/:jntuno" element={<Deletestudent />} />
          <Route path="downloadstudents" element={<StudentDownload />} />
          
        </Routes>
        
        <Outlet />
        </div>
    </div>
  );
}

export default Studentcomponent;