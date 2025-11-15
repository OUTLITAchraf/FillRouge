import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ClientRoute({ children }) {
  const token = Cookies.get("authToken");
  const user = Cookies.get("authUser")? JSON.parse(Cookies.get("authUser")):null;
  const role = user?.roles?.[0].name;

  // If no token → user not logged in
  if (!token ) {
    return <Navigate to="/login" replace />;
  }
  if (role != "client") {
    return <Navigate to="/unauthorized" replace />;
  }


  return children;
}
