
import React from "react";
import '../admindashstyle.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import '../pages/view.css';
import BranchSideBar from "./BranchSideBar";
import AddCourse from "./courses/AddCourse";
import CoursesList from "./courses/CoursesList";
import CourseUpload from "./courses/CoursesUpload";
import DownloadCourses from "./courses/DownloadCourses";
import EditCourse from "./courses/EditCourse";
import BranchAnalytics from "./branches/BranchAnalytics";
function BranchViewComponent() {


  return (

    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '13%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BranchSideBar />
      </div>
      <div className="overflow-y-scroll scroll-hidden downscroll" style={{ width: '87%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Routes>
          <Route path="" element={<BranchAnalytics />} />
          <Route index path='addcourse' element={<AddCourse />} />
          <Route index path='viewcourses' element={<CoursesList />} />
          <Route path="editcourse/:coursecode" element={<EditCourse />} />
          <Route path="bulkuploadcourses" element={<CourseUpload />} />
          <Route path="downloadcourses" element={<DownloadCourses />} />
        </Routes>

        <Outlet />
      </div>
    </div>
  );
}

export default BranchViewComponent;



