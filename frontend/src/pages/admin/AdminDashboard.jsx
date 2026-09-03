import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login as an admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(response.data);
      setError("");
    } catch (error) {
      console.error("Failed to fetch admin dashboard:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-3 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 sm:p-8 text-center max-w-md w-full">
          <div className="text-3xl sm:text-5xl mb-3 sm:mb-4">
            ⚠️
          </div>

          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            Unable to Load Dashboard
          </h2>

          <p className="text-xs sm:text-base text-gray-600 mt-2 break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    users = {},
    professionals = {},
    bookings = {},
    reviews = {},
    notifications = {},
    revenue = {},
  } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50 px-2.5 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Admin Dashboard
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            Manage and monitor your FixNear platform.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          className="
            shrink-0
            px-2.5
            sm:px-4
            py-1.5
            sm:py-2.5
            bg-white
            border
            border-gray-200
            text-gray-700
            text-[10px]
            sm:text-sm
            rounded-lg
            hover:bg-gray-50
            transition
            whitespace-nowrap
          "
        >
          🔄 <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-5 mb-4 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Total Users
              </p>

              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {users.total || 0}
              </h2>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Professionals
              </p>

              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {professionals.total || 0}
              </h2>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              👷
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Total Bookings
              </p>

              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {bookings.total || 0}
              </h2>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              📅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Total Revenue
              </p>

              <h2 className="text-lg sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2 break-all">
                ₹{(revenue.total || 0).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-yellow-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-6">
          <h2 className="text-sm sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6">
            Professional Overview
          </h2>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-5">
              <p className="text-[9px] sm:text-sm text-gray-500">
                Total
              </p>

              <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                {professionals.total || 0}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-2.5 sm:p-5">
              <p className="text-[9px] sm:text-sm text-gray-500">
                Verified
              </p>

              <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1">
                {professionals.verified || 0}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-2.5 sm:p-5">
              <p className="text-[9px] sm:text-sm text-gray-500 leading-tight">
                Pending Verification
              </p>

              <p className="text-lg sm:text-2xl font-bold text-yellow-600 mt-1">
                {professionals.unverified || 0}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-2.5 sm:p-5">
              <p className="text-[9px] sm:text-sm text-gray-500">
                Admins
              </p>

              <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">
                {users.admins || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-6">
          <h2 className="text-sm sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6">
            Booking Overview
          </h2>

          <div className="space-y-2.5 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-base text-gray-600">
                Pending
              </span>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded-full text-[9px] sm:text-sm font-medium">
                {bookings.pending || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-base text-gray-600">
                Confirmed
              </span>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] sm:text-sm font-medium">
                {bookings.confirmed || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-base text-gray-600">
                In Progress
              </span>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-[9px] sm:text-sm font-medium">
                {bookings.inProgress || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-base text-gray-600">
                Completed
              </span>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-[9px] sm:text-sm font-medium">
                {bookings.completed || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-base text-gray-600">
                Cancelled
              </span>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-full text-[9px] sm:text-sm font-medium">
                {bookings.cancelled || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-5">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-yellow-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              ⭐
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Total Reviews
              </p>

              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {reviews.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              🔔
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Unread Notifications
              </p>

              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {notifications.unread || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-2xl">
              ✅
            </div>

            <div className="min-w-0">
              <p className="text-[9px] sm:text-sm text-gray-500 truncate">
                Completed Bookings
              </p>

              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {bookings.completed || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;