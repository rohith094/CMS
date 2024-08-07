
import React from "react";
import '../admindashstyle.css';
import Studentsidebar from "./Studentsidebar";
import { Routes, Route,Outlet } from 'react-router-dom';
import Addstudent from '../pages/Addstudent';
import Addstudents from "../pages/Addstudents";
import Viewstudentsdata from "../pages/Viewstudentsdata";
import '../pages/view.css';
import Singlestudent from "../pages/Singlestudent";
import UpdateStudent from "../pages/UpdateStudent";

function Studentcomponent() {
  

  return (
    
    <div style={{ height : '100vh', display: 'flex', justifyContent : 'center', alignItems : 'center'}}>
        <div  style={{width : '13%',height : '100vh', display: 'flex', justifyContent : 'center', alignItems: 'center'}}>
        <Studentsidebar />
        </div>
        <div  className="overflow-y-scroll scroll-hidden downscroll"  style={{width : '87%', height : '100vh', display : 'flex' , justifyContent : 'center', alignItems: 'center'}}>
        <Routes>
          <Route index path='addstudent' element={<Addstudent />} />
          <Route path="addstudents" element={<Addstudents />} />
          <Route path="viewstudents" element={<Viewstudentsdata />} />
          <Route path="viewstudents/:jntuno" element={<Singlestudent />} />
          <Route path="updatestudent/:jntuno" element={<UpdateStudent />} />
        </Routes>
        
        <Outlet />
        </div>
    </div>
  );
}

export default Studentcomponent;