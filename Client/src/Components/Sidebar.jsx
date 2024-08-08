// import React, { useState, useEffect, useRef } from 'react';
// import { NavLink } from 'react-router-dom';
// import dp from '../Assets/dp.png';
// import { PiExamFill } from "react-icons/pi";
// import { TbLayoutDashboardFilled } from "react-icons/tb";
// import { HiAcademicCap } from "react-icons/hi2";
// import { MdEmojiEvents, MdFeedback, MdWork } from "react-icons/md";
// import { FaTasks } from "react-icons/fa";
// import Logout from '../Pages/Logout';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [userData, setUserData] = useState({});

//   const sidebarRef = useRef(null);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const closeSidebar = () => {
//     setIsOpen(false);
//   };


//   const fetchUserData = async () => {
//     try {
//       const token = Cookies.get('token');
//       const response = await axios.get('http://localhost:3001/student/singlestudent', {
//         headers: {
//           Authorization: `${token}`,
//         }
//       }); // assuming you have an endpoint to fetch user data
//       setUserData(response.data);

//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     // Fetch user data from the backend
//     fetchUserData();
//   }, []);



//   return (
//     <div>
//       <div className='flex z-50 justify-between items-center py-8 sm:py-0 md:py-0 lg:py-0'>
//         <button
//           onClick={toggleSidebar}
//           aria-controls="default-sidebar"
//           type="button"
//           className="inline-flex items-center p-2 ms-3 text-sm text-black bg-gray-100 border border-cyan-200 rounded-full sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 fixed">
//           <span className="sr-only">Open sidebar</span>
//           <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//             <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
//           </svg>
//         </button>
//       </div>


//       <aside
//         ref={sidebarRef}
//         id="default-sidebar"
//         className={`fixed top-0 bottom-0 left-0 z-40 w-64 shadow-lg  transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
//         aria-label="Sidebar">
//         <div style={{background:"#1A2438", color : 'white'}} className="h-full px-3 py-4 overflow-y-auto border border-gray-300 ">
//           <ul className="space-y-2 font-medium">
//             <li className="border border-blue-950 mb-6 shadow-lg h-[28vh] bg-cyan-950 rounded-2xl">
//               <a href="#" className="flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-900 group" onClick={closeSidebar}>
//                 <div className="relative flex items-center">
//                   <img src={userData.imageurl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
//                   <button className="absolute bottom-0 right-0 bg-cyan-200 text-white rounded-full p-1 hover:bg-white">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536M9 11l3 3-6 6H3v-3l6-6z" />
//                     </svg>
//                   </button>
//                 </div>
//                 <span className="ml-3 text-white text-1xl">
//                   <span className='text-lg text-blue-100'>Hello,</span><br></br>
//                   <span style={{textTransform : 'uppercase'}}>{userData.jntuno}</span>
//                 </span>
//               </a>
//               <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '5px' }}>
//                 <span style={{ fontSize: '13px', textTransform: 'capitalize' }} className='text-white'>{userData.firstname}  {userData.lastname}</span>
//                 <span style={{ fontSize: '13px' }} className='text-white'>B.Tech  {userData.branch}</span>

//               </div>
//             </li>

//             <li>
//               <NavLink
//                 to="dashboard"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <TbLayoutDashboardFilled className="h-[20px] w-[20px]" />
//                 <span className="ms-3">Dashboard</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="academics"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <HiAcademicCap className='w-[20px] h-[20px]' />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Academics</span>
//                 <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-black bg-white border border-cyan-900 rounded-full">Pro</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="examinations"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <PiExamFill className='w-[20px] h-[20px]' />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Examinations</span>
//                 <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-white border border-cyan-900 rounded-full">3</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="attendance"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <FaTasks className='w-[20px] h-[20px]' />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Attendance</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="placements"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <MdWork className='w-[20px] h-[20px]' />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Placements</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="feedback"
//                 className={({ isActive }) => isActive ? "flex items-center p-2 text-gray-900 rounded-2xl bg-cyan-200" : "flex items-center p-2 text-gray-900 rounded-2xl hover:bg-cyan-100 group"}
//                 onClick={closeSidebar}
//               >
//                 <MdFeedback className='w-[20px] h-[20px]' />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
//               </NavLink>
//             </li>

//             <li>
//               {/* <Logout /> */}
//             </li>
//           </ul>
//           <Logout />
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import dp from '../Assets/dp.png';
import { CgMenuLeftAlt } from "react-icons/cg";
import { PiExamFill } from "react-icons/pi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiAcademicCap } from "react-icons/hi2";
import { MdFeedback, MdWork } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import Logout from '../Pages/Logout';
import axios from 'axios';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [userData, setUserData] = useState({});

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
  };


  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:3001/student/singlestudent', {
        headers: {
          Authorization: `${token}`,
        }
      }); 
      setUserData(response.data);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);



  return (
    <div>
      <div className='flex z-50 justify-between items-center py-8 sm:py-0 md:py-0 lg:py-0'>
        <button
          onClick={toggleSidebar}
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center bg-d0 p-2 ms-3 text-md text-white rounded-full sm:hidden hover:bg-gray-100 fixed">
          <span className="sr-only">Open sidebar</span>
          <CgMenuLeftAlt className='h-7 w-7'/>
        </button>
      </div>


      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={` bg-d3 md:w-[20vw] lg:w-[20vw] sm:w-[20vw] fixed top-0 bottom-0 left-0 z-40 w-64 shadow-lg transition-transform rounded-tr-2xl rounded-br-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <NavLink 
            to='profile'
            >
            <li className=" mb-4 shadow-lg h-auto pb-3 bg-d4  rounded-2xl">
              <div className="flex items-center p-2 text-plat bg-d2 rounded-2xl hover:bg-d1 group" onClick={closeSidebar}>
                <div className="relative flex items-center">
                  <img src={userData.imageurl || dp} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  <button className="absolute bottom-0 right-0 bg-plat border-d0 border text-white rounded-full p-1 hover:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536M9 11l3 3-6 6H3v-3l6-6z" />
                    </svg>
                  </button>
                </div>
                <div className="ml-3 text-white text-1xl text-left">
                <span className="text-lg text-blue-100">Hello,</span><br />
                <span style={{ textTransform: 'uppercase' }}>{userData.jntuno}</span>
              </div>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'flex-start', flexDirection: 'column', marginTop: '5px', paddingLeft: '8px' }}>
                <span style={{ fontSize: '13px', textTransform: 'capitalize' }} className='text-white'>{userData.firstname} {userData.lastname}</span>
                <span style={{ fontSize: '13px' }} className='text-white'>B.Tech {userData.branch}</span>
              </div>

            </li>
            </NavLink>
            <li>
              <NavLink
                to="dashboard"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <TbLayoutDashboardFilled className="h-[20px] w-[20px]" />
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="academics"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <HiAcademicCap className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Academics</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-black bg-white border border-cyan-900 rounded-full">5</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="examinations"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <PiExamFill className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Examinations</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-white border border-cyan-900 rounded-full">3</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="attendance"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <FaTasks className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="placements"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <MdWork className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Placements</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/events"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <MdEmojiEvents className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Events</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="feedback"
                className={({ isActive }) => isActive ? "flex items-center p-2 text-plat rounded-2xl bg-d1" : "flex items-center p-2 text-plat rounded-2xl hover:bg-d2 group"}
                onClick={closeSidebar}
              >
                <MdFeedback className='w-[20px] h-[20px]' />
                <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
              </NavLink>
            </li>

            <li>
              {/* <Logout /> */}
            </li>
          </ul>
          <Logout />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

