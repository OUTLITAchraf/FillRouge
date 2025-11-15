import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const {token, user} = useSelector((state) => state.auth);
  const role = user?.roles?.[0]?.name;

  // If user is authenticated, redirect based on role
  if (!token ) {
    return <Navigate to="/login" replace />;
  }
  if (role != "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
