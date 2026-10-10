import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only normal users can access these routes
  if (user.role !== "user") {
    if (user.role === "professional") {
      return <Navigate to="/professional-dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;