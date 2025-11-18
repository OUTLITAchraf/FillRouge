import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProviderRoute() {
  const {token, user} = useSelector((state) => state.auth);
  const role = user?.roles?.[0]?.name;
  const providerStatus = user?.status;

  if (!token || providerStatus === "pending") {
    return <Navigate to="/login" replace />;
  }
  
  if (role != "provider" || providerStatus === "rejected") {
    return <Navigate to="/unauthorized" replace />;
  }

  // if ( ) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
}
