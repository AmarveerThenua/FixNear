import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProfessionalRoute = () => {
  const token = localStorage.getItem("fixnearToken");

  const [loading, setLoading] = useState(true);
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const checkProfessional = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Checking professional account...");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Professional account found:",
          response.data.professional
        );

        setIsProfessional(true);
      } catch (error) {
        console.error(
          "Professional check failed:",
          error.response?.data || error.message
        );

        setIsProfessional(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfessional();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Checking professional account...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfessional) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProfessionalRoute;