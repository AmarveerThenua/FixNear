import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("fixnearToken");
  const userData = localStorage.getItem("fixnearUser");


  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  
  try {
    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }


    return <Outlet />;
  } catch (error) {
    console.error(
      "AdminRoute user data error:",
      error
    );

    localStorage.removeItem("fixnearToken");
    localStorage.removeItem("fixnearUser");

    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;