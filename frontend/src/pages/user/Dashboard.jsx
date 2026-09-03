import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("fixnearToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookings = response.data.bookings || [];

        const activeBookings = bookings.filter((booking) =>
          ["pending", "confirmed", "in-progress"].includes(
            booking.status
          )
        );

        const completedBookings = bookings.filter(
          (booking) => booking.status === "completed"
        );

        setStats({
          total: bookings.length,
          active: activeBookings.length,
          completed: completedBookings.length,
        });
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        setStats({
          total: 0,
          active: 0,
          completed: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 wrap-break-word">
            Welcome, {user?.name} 👋
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Manage your services and bookings from here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-7 sm:mt-9 md:mt-10">
          <div className="bg-[#2563EB]  p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm sm:text-base text-white">
              Total Bookings
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? "..." : stats.total}
            </p>
          </div>

          <div className="bg-[#F59E0B]   p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm sm:text-base text-white">
              Active Bookings
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? "..." : stats.active}
            </p>
          </div>

          <div className="bg-[#16A34A]  p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <p className="text-sm sm:text-base text-white">
              Completed
            </p>

            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? "..." : stats.completed}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;