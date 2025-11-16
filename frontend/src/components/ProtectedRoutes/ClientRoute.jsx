import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export default function ClientRoute() {
  const { token, user } = useSelector((state) => state.auth);
  const role = user?.roles?.[0].name;

  // If no token → user not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role != "client") {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
}
