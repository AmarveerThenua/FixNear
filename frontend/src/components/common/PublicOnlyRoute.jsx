import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicOnlyRoute = () => {
  const { user } = useAuth();

  // Guest → allow public page
  if (!user) {
    return <Outlet />;
  }

  // Logged-in user → user dashboard
  if (user.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  // Logged-in professional → professional dashboard
  if (user.role === "professional") {
    return <Navigate to="/professional-dashboard" replace />;
  }

  // Logged-in admin → admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Unknown role
  return <Navigate to="/login" replace />;
};

export default PublicOnlyRoute;