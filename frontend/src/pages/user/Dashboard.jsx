import React from "react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6">
        {/* =========================
            Welcome Header
        ========================= */}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Welcome, {user?.name} 👋
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Manage your services and bookings from here.
          </p>
        </div>

        {/* =========================
            Dashboard Stats
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-7 sm:mt-9 md:mt-10">
          {/* Total Bookings */}

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm sm:text-base text-gray-500">
              Total Bookings
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              0
            </p>
          </div>

          {/* Active Bookings */}

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm sm:text-base text-gray-500">
              Active Bookings
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              0
            </p>
          </div>

          {/* Completed */}

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <p className="text-sm sm:text-base text-gray-500">
              Completed
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              0
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;