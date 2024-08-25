// import React from 'react'
// import { Link, Routes, Route, Outlet } from 'react-router-dom';
// import AddCourse from './courses/AddCourse';

// const BranchViewComponent = () => {
//   return (
//     <div>
//       <Link to="addcourse">Add Course</Link>

//       <Routes>
//           <Route path="addcourse" element={<AddCourse />} />
//       </Routes>

//         <Outlet />
//     </div>
//   )
// }

// export default BranchViewComponent;


import React from "react";
import '../admindashstyle.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import '../pages/view.css';
import Singlestudent from "../pages/Singlestudent";
import UpdateStudent from "../pages/UpdateStudent";
import Welcomepage from "../pages/Welcomepage";
import ViewAdmissions from "./ViewAdmissions";
import BulkUpdateComponent from "../pages/BulkUpdateComponent";
import DownloadFilteredData from "../pages/DownloadFilteredData";
import BranchSideBar from "./BranchSideBar";
import AddCourse from "./courses/AddCourse";
import CoursesList from "./courses/CoursesList";
function BranchViewComponent() {


  return (

    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '13%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BranchSideBar />
      </div>
      <div className="overflow-y-scroll scroll-hidden downscroll" style={{ width: '87%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Routes>
          <Route path="" element={<Welcomepage />} />
          <Route index path='addcourse' element={<AddCourse />} />
          <Route index path='viewcourses' element={<CoursesList />} />
        </Routes>

        <Outlet />
      </div>
    </div>
  );
}

export default BranchViewComponent;



