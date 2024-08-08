
import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import BottomNavbar from './Components/BottomNavbar';
import Academics from './Pages/Academics';
import Examinations from './Pages/Examinations';
import Dashboard from './Pages/Dashboard';
import Placements from './Pages/Placements';
import Events from './Pages/Events';
import Attendance from './Pages/Attendance';
import Feedback from './Pages/Feedback';
import NotFoundPage from './NotFoundPage';
import ViewProfile from './Pages/ViewProfile';


const Mainpage = () => {
  return (
    <div className="overflow-x-hidden bg-d4 sm:bg-white md:bg-white lg:bg-white w-[100vw] flex flex-col items-start">
      <div className=' flex flex-row fixed bg-d4 justify-between items-center w-full z-20'>
        <div className='w-[20%]'>
          <Sidebar />
        </div>
        <div>

          <form class="flex only-mobile items-center mr-2">
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-[75%]">
              <div class="absolute inset-y-0 start-0 flex items-center  pointer-events-none">
              </div>
              <input type="text" id="simple-search" class="bg-neutral-100 text-gray-800 placeholder:text-gray-500 text-sm rounded-full block w-full p-2.5" placeholder="Search" />
            </div>
            <button class="p-3 ms-2 text-sm font-medium text-white bg-d0 rounded-full  hover:bg-neutral-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span class="sr-only">Search</span>
            </button>
          </form>

        </div>
      </div>
      <div className='sm:pl-[20%] md:pl-[20%] lg:pl-[20%] w-[100vw]'>
        <Routes>
          <Route index path='dashboard' element={<Dashboard />} />
          <Route path='academics' element={<Academics />} />
          <Route path='examinations' element={<Examinations />} />
          <Route path='attendance' element={<Attendance />} />
          <Route path='placements' element={<Placements />} />
          <Route path='events' element={<Events />} />
          <Route path='feedback' element={<Feedback />} />
          <Route path='profile' element={<ViewProfile />} />

          {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <div className='w-[80%] grid grid-cols-2 '>
          <Sidebar />
          <Outlet />
        </div>
      </div>
      <div className='w-full z-1'>
        <BottomNavbar />
      </div>
    </div>
  )
}

export default Mainpage