
import React from "react";
import '../admindashstyle.css';
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
import AdmissionSidebar from "./AdmissionSidebar";
import ViewAdmissions from "./ViewAdmissions";
import BulkUpdateComponent from "../pages/BulkUpdateComponent";
function AdmissionComponent() {
  

  return (
    
    <div style={{ height : '100vh', display: 'flex', justifyContent : 'center', alignItems : 'center'}}>
        <div  style={{width : '13%',height : '100vh', display: 'flex', justifyContent : 'center', alignItems: 'center'}}>
        <AdmissionSidebar />
        </div>
        <div  className="overflow-y-scroll scroll-hidden downscroll"  style={{width : '87%', height : '100vh', display : 'flex' , justifyContent : 'center', alignItems: 'center'}}>
        <Routes>
          <Route path="" element={<Welcomepage />} />
          <Route index path='addstudent' element={<AdmitStudentForm />} />
          <Route path="viewadmissions" element={<ViewAdmissions />} />    
          <Route path="viewstudent/:registrationid" element={<Singlestudent />} />  
          <Route path="updatestudent/:registrationid" element={<UpdateStudent />} />
          <Route path="bulkupdate" element={<BulkUpdateComponent />} />
          {/* <Route path="viewstudents" element={<StudentSearch />} />
          <Route path="viewstudents/:jntuno" element={<Singlestudent />} />
          <Route path="updatestudent/:jntuno" element={<UpdateStudent />} />
          <Route path="deletestudent/:jntuno" element={<Deletestudent />} />
          <Route path="downloadstudents" element={<StudentDownload />} /> */}
          
        </Routes>
        
        <Outlet />
        </div>
    </div>
  );
}

export default AdmissionComponent;