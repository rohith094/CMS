import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Mainpage from './Mainpage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Adminprotectedroute from './Adminprotectedroute';
import ResetPassword from './Pages/Reset';
import NotFoundPage from './NotFoundPage';
import './app.css';
function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/resetpassword' element={<ResetPassword />}></Route>
        <Route path='admin/login' element={<AdminLogin />} />
        <Route path="student/login" element={<Login />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/student/*" element={<Mainpage />} />

        </Route>

        <Route element={<Adminprotectedroute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
