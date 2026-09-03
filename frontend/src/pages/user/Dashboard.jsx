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
    <section className="min-h-screen bg-gray-50 py-5 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6">
        <div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
            Welcome, {user?.name} 👋
          </h1>

          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
            Manage your services and bookings from here.
          </p>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 mt-5 sm:mt-7 md:mt-9">
          <div className="bg-[#2563EB] p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-base text-white leading-tight">
              Total Bookings
            </p>

            <p className="mt-1 sm:mt-1.5 md:mt-2 text-xl min-[400px]:text-2xl sm:text-3xl font-bold text-white">
              {loading ? "..." : stats.total}
            </p>
          </div>

          <div className="bg-[#F59E0B] p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-base text-white leading-tight">
              Active Bookings
            </p>

            <p className="mt-1 sm:mt-1.5 md:mt-2 text-xl min-[400px]:text-2xl sm:text-3xl font-bold text-white">
              {loading ? "..." : stats.active}
            </p>
          </div>

          <div className="bg-[#16A34A] p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-base text-white leading-tight">
              Completed
            </p>

            <p className="mt-1 sm:mt-1.5 md:mt-2 text-xl min-[400px]:text-2xl sm:text-3xl font-bold text-white">
              {loading ? "..." : stats.completed}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;