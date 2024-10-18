
import React, { useState } from "react";
import * as XLSX from "xlsx";
import './admindashstyle.css';
import AdminSidebar from "./AdminSidebar";
import { Routes, Route,Outlet } from 'react-router-dom';
import Studentcomponent from "./components/Studentcomponent";
import { Facultydata } from "./components/Facultydata";
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
        {/* <div className="right w-[80vw] bg-black-500 ml-[5px] mr-[5px] overflow-hidden mt-[20px]">
          <div className="flex justify-between items-center w-full min-w-[900px]">
            <div className="flex items-center justify-center bg-gray-100">
              <button
                onClick={handleClick}
                className="ml-4 px-4 py-2 pt-[0.5rem] font-semibold text-white bg-cyan-950 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
              >
                Upload File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleClick}
                className="ml-3 px-4 py-2 pt-[0.5rem] font-semibold text-white bg-cyan-950 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
              >
                Download
              </button>
            </div>
            
            <div className="flex justify-center items-center relative">
              <form className="flex items-center max-w-lg mx-auto mr-[0.5rem]">
                <label htmlFor="voice-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 21 21"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="voice-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                  >
                  
                  </button>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-cyan-950 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                
                </button>
              </form>
            </div>
          </div>
          <div className="relative h-full pb-[3rem]">
            <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
              <table className="w-full min-w-[900px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}

        <div className='w-[80vw]'>
        <Routes>
          <Route index path='studentsdata/*' element={<Studentcomponent />} /> 
          <Route  path='admissions/*' element={<AdmissionComponent />} /> 
          <Route path='facultydata' element={<Facultydata />} />
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
      {/* <div className='w-full z-1'>
        <BottomNavbar />
      </div> */}
      </div>
    </div>
  );
}

export default AdminDashboard;