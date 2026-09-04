import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (user.role === "professional") {
    return <Navigate to="/professional-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;