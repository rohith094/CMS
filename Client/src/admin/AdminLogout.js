import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';

const AdminLogout = () => {
  const navigate = useNavigate();
  const handleLogout = ()=>{
      // Clear the token from cookies
      Cookies.remove('admintoken');
      
      // Show a logout success message
      toast.success('Logout Successful');
  
      // Redirect to login page
      navigate('/admin/login');
  }

  return (
    <button
            type="button"
            style={{width: '100%', background : '#4D869C' , color : 'white' , borderRadius : '8px', display : 'flex', justifyContent : 'center', alignItems : 'center', padding : '8px'}}
            onClick={handleLogout}
          >
                Logout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
          </button>
  );
};

export default AdminLogout;
