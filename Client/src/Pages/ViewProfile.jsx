import React,{useState,useEffect} from 'react';
import dp from '../Assets/dp.png';
import axios from 'axios';
import Cookies from 'js-cookie';

const ViewProfile = () => {
    const ProfileData = {
        id: 1,
        jntuno: "21341A0599",
        email: "21341a0599@gmrit.edu.in",
        spassword: "password123",
        firstname: "Harsha Vardhan",
        lastname: "Majji",
        branch: "B.Tech CSE",
        joiningyear: 2021,
        currentyear: 4,
        phone: "8008858347",
        department: "Department of Computer Science and Engineering",
        academicStatus: "Regular",
        imageurl: dp
    };

    const [userData, setUserData] = useState({});

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
        <section className="w-[100%] h-[100vh] mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
            <div className="my-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Student Profile</h1>
                <div className="relative my-2">
                <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                </div>
                <div className="flex items-center my-6 bg-d1 rounded-2xl">
                    <img
                        src={userData.imageurl || dp}
                        alt="Profile"
                        className="w-32 h-32 rounded-2xl object-cover border-2  border-plat"
                    />
                    <div className="ml-6">
                        <div className="text-xl sm:text-4xl md:text-4xl lg:text-4xl font-semibold text-white">{userData.firstname} {userData.lastname}</div>
                        <div className="text-plat text-md sm:text-xl md:text-xl lg:text-xl">{userData.jntuno}</div>
                    </div>
                </div>

                <div className="bg-zinc-350 p-6 rounded-xl border border-plat bg-plat1">
                    <div className="">
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Email:</label>
                            <span className="text-gray-700">{userData.email}</span>
                        </div>
                         <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Phone:</label>
                            <span className="text-gray-700">{userData.phone || ProfileData.phone}</span>
                        </div>
                        <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Department:</label>
                            <span className="text-gray-700">{userData.branch}</span>
                        </div>
                        <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Academic Status:</label>
                            <span className="text-gray-700">{userData.academicStatus || ProfileData.academicStatus}</span>
                        </div>
                            <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Programme:</label>
                            <span className="text-gray-700">Btech {userData.branch}</span>
                        </div>
                        <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Batch Year:</label>
                            <span className="text-gray-700">{userData.joiningyear}</span>
                        </div>
                        <div className='relative'>
                            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
                            </div>
                        <div className="flex items-center justify-between mt-3">
                            <label className="w-40 font-semibold text-gray-900">Current Year:</label>
                            <span className="text-gray-700">{userData.currentyear}th Year</span>
                        </div>
                        
                    </div>
                </div>
                </div>
        </section>
    );
};

export default ViewProfile;