import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute() {
  const {token, user} = useSelector((state) => state.auth);
  const role = user?.roles?.[0]?.name;

  // If user is authenticated, redirect based on role
  if (token && user) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "provider":
        return <Navigate to="/provider/dashboard" replace />;
      case "client":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
