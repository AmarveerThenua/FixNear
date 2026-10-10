import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User trying to access admin routes
  if (user.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  // Professional trying to access admin routes
  if (user.role === "professional") {
    return <Navigate to="/professional-dashboard" replace />;
  }

  // Admin is allowed
  return <Outlet />;
};

export default AdminRoute;