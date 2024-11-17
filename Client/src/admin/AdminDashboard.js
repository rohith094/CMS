
import React, { useState } from "react";
import * as XLSX from "xlsx";
import './admindashstyle.css';
import AdminSidebar from "./AdminSidebar";
import { Routes, Route,Outlet } from 'react-router-dom';
import Studentcomponent from "./components/Studentcomponent";
// import { Facultydata } from "./components/Facultydata";
import { Subjectsdata} from "./components/Subjectsdata";
import { Attendancedata } from "./components/Attendancedata";
import { Examinationsdata } from "./components/Examinationsdata";
import { Placementsdata } from "./components/Placementsdata";
// import { Feedbackdata } from "./components/Feedbackdata";
import Feedbacks from "./Feedbacks";
import SemesterComponent from "./components/SemesterComponent";
import SectionComponent from "./components/SectionComponent";
import BranchComponent from "./components/BranchComponent";
import CourseComponent from "./components/CourseComponent";
import AdmissionComponent from "./components/AdmissionComponent";
import BranchViewComponent from "./components/BranchViewComponent";
import Curriculumns from "./components/Curriculumns";
import ViewCurriculum from "./components/ViewCurriculum";
import CurriculumComponent from "./components/CiruculumComponent";
import Sections from "./components/Sections";
import ViewSemesterComponent from "./components/semesters/ViewSemesterComponent";
import FacultyComponent from "./components/FacultyComponent";

function AdminDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const fileInputRef = React.createRef();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          setTableHeaders(jsonData[0]);
          setTableData(jsonData.slice(1));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex w-full h-[100vh]">
        <div className="left w-[20vw]">
          <AdminSidebar />
        </div>
        <div className='w-[80vw]'>
        <Routes>
          <Route index path='studentsdata/*' element={<Studentcomponent />} /> 
          <Route  path='admissions/*' element={<AdmissionComponent />} /> 
          <Route path='facultycomponent/*' element={<FacultyComponent />} />
          <Route path='subjectsdata' element={<Subjectsdata />} />
          <Route path='attendancedata' element={<Attendancedata />} />
          <Route path='examinationsdata' element={<Examinationsdata />} />
          <Route path='placementsdata' element={<Placementsdata />} />
          <Route path='feedbackdata' element={<Feedbacks />} />
          <Route path="semesters/*" element={<SemesterComponent />} />
          <Route path="semesters/:semesternumber/*" element={<ViewSemesterComponent />} />
          <Route path="branches/*" element={<BranchComponent />} />
          <Route path="branch/:branchcode/*" element={<BranchViewComponent />} />
          <Route path="curriculum/*" element={<Curriculumns />} />
          <Route path="curriculum/:branchcode/*" element={<CurriculumComponent />} />
          <Route path="sections/*" element={<Sections />} />
          <Route path="sections/:branchcode/*" element={<SectionComponent/>} />
        </Routes>
        <Outlet />
      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;