import React from 'react'
import { Routes, Route,Outlet } from 'react-router-dom';
import AddBranch from './branches/AddBranch';
import EditBranch from './branches/EditBranch';
import Branches from './Branches'
const BranchComponent = () => {
  return (
    <div >
        
        
        <Routes>
          <Route path="" element={<Branches/>} />
          <Route path="addbranch" element={<AddBranch/>}/>
          <Route path="editbranch/:branchID" element={<EditBranch/>} />
        </Routes>
        
        <Outlet />
      
    </div>
  )
}

export default BranchComponent
