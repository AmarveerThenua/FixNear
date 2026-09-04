import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (user.role === "professional") {
    return <Navigate to="/professional-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;