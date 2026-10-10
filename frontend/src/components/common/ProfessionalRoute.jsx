import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfessionalRoute = () => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User trying to access professional routes
  if (user.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin trying to access professional routes
  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Professional is allowed
  return <Outlet />;
};

export default ProfessionalRoute;