import React from "react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {

  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gray-50 py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name} 👋
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your services and bookings from here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">
              Active Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Dashboard;