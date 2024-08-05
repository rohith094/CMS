import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { LiaBookSolid } from "react-icons/lia";

const BottomNavbar = () => {
    return (
        <div className='mr-2 ml-2'>
<div class=" only-mobile fixed bottom-0 left-0 z-1 w-full h-16 bg-cyan-950">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <button type="button" class="inline-flex flex-col items-center justify-center px-2 hover:bg-cyan-800 rounded-full my-3 mx-3 group">
        < IoHomeOutline  className='w-[25px] h-[25px] text-white'/>
            {/* <span class="text-xs text-gray-500 group-hover:text-white">Home</span> */}
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-2 hover:bg-cyan-800 rounded-full my-3 mx-3 group">
        < VscFeedback  className='w-[25px] h-[25px] text-white'/>
            {/* <span class="text-xs text-gray-500 group-hover:text-white">Home</span> */}
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-2 hover:bg-cyan-800 rounded-full my-3 mx-3 group">
        < LiaBookSolid  className='w-[25px] h-[25px] text-white'/>
            {/* <span class="text-xs text-gray-500 group-hover:text-white">Book</span> */}
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-2 hover:bg-cyan-800 rounded-full my-3 mx-3 group">
        < IoIosNotificationsOutline  className='w-[25px] h-[25px] text-white'/>
            {/* <span class="text-xs text-gray-500 group-hover:text-white">Home</span> */}
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-2 hover:bg-cyan-800 rounded-full my-3 mx-3 group">
        < IoSettingsOutline className='w-[25px] h-[25px] text-white'/>
            {/* <span class="text-xs text-gray-500 group-hover:text-white">Home</span> */}
        </button>
    </div>
</div>
</div>
    );
};

export default BottomNavbar;
