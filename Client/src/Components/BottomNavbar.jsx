import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { LiaBookSolid } from "react-icons/lia";

const BottomNavbar = () => {
    const [activeLink, setActiveLink] = useState('home');

    const handleNavLinkClick = (linkName) => {
        setActiveLink(linkName);
    };

    return (
        <div className='mr-2 ml-2'>
            <div className="only-mobile fixed bottom-0 left-0 z-1 w-full h-16 bg-d4">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                    <NavLink
                        to="#"
                        className={`inline-flex flex-col items-center justify-center px-2 ${activeLink === 'feedback' ? 'bg-d0' : 'hover:bg-d1'} rounded-full my-4 mx-3 group`}
                        onClick={() => handleNavLinkClick('feedback')}
                    >
                        <VscFeedback className='w-[25px] h-[25px] text-white' />
                    </NavLink>
                    <NavLink
                        to="#"
                        className={`inline-flex flex-col items-center justify-center px-2 ${activeLink === 'book' ? 'bg-d0' : 'hover:bg-d1'} rounded-full my-4 mx-3 group`}
                        onClick={() => handleNavLinkClick('book')}
                    >
                        <LiaBookSolid className='w-[25px] h-[25px] text-white' />
                    </NavLink>
                    <NavLink
                        to="#"
                        className={`inline-flex flex-col items-center justify-center px-2 ${activeLink === 'home' ? 'bg-d0' : 'hover:bg-d1'} rounded-full my-4 mx-3 group`}
                        onClick={() => handleNavLinkClick('home')}
                    >
                        <IoHomeOutline className='w-[25px] h-[25px] text-white' />
                    </NavLink>
                    <NavLink
                        to="#"
                        className={`inline-flex flex-col items-center justify-center px-2 ${activeLink === 'notifications' ? 'bg-d0' : 'hover:bg-d1'} rounded-full my-4 mx-3 group`}
                        onClick={() => handleNavLinkClick('notifications')}
                    >
                        <IoIosNotificationsOutline className='w-[25px] h-[25px] text-white' />
                    </NavLink>
                    <NavLink
                        to="#"
                        className={`inline-flex flex-col items-center justify-center px-2 ${activeLink === 'settings' ? 'bg-d0' : 'hover:bg-d1'} rounded-full my-4 mx-3 group`}
                        onClick={() => handleNavLinkClick('settings')}
                    >
                        <IoSettingsOutline className='w-[25px] h-[25px] text-white' />
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;
