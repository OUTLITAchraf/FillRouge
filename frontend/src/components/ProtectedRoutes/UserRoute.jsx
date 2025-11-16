import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function UserRoute() {
  const {user} = useSelector((state) => state.auth);
  const role = user?.roles?.[0]?.name;

  if (role == 'admin') {
    return <Navigate to={'/admin/dashboard'} replace />
  }
  if (role == 'provider') {
    return <Navigate to={'/provider/dashboard'} replace />
  }

  return <Outlet />
}

export default UserRoute