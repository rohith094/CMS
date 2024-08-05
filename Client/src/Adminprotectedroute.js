import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const Adminprotectedroute = () => {
  const token = Cookies.get('admintoken');

  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default Adminprotectedroute;