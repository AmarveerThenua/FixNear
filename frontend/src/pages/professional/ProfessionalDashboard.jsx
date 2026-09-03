import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfessionalDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("fixnearToken");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/professional`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Fetch professional bookings error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Loading your bookings...
          </p>
        </div>
      </section>
    );
  }

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <section className="min-h-screen bg-gray-50 py-5 sm:py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-6 min-w-0">
        <div className="mb-5 sm:mb-7 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Professional Dashboard
          </h1>

          <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-base text-gray-600">
            Manage your customer bookings and services.
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-2.5 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[10px] sm:text-xs lg:text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 mb-5 sm:mb-7 lg:mb-8">
          <div className="bg-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm">
            <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-blue-100 leading-tight">
              Total
            </p>

            <p className="mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {bookings.length}
            </p>
          </div>

          <div className="bg-orange-500 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm">
            <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-orange-100 leading-tight">
              Pending
            </p>

            <p className="mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {pendingBookings}
            </p>
          </div>

          <div className="bg-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm">
            <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-purple-100 leading-tight">
              Confirmed
            </p>

            <p className="mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {confirmedBookings}
            </p>
          </div>

          <div className="bg-green-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm">
            <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-green-100 leading-tight">
              Completed
            </p>

            <p className="mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {completedBookings}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
            <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
              Customer Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-6 sm:p-10 lg:p-12 text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">
                📅
              </div>

              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                No Bookings Yet
              </h3>

              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Customer bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gray-50 transition min-w-0 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 lg:gap-5 min-w-0">
                    <div className="min-w-0 lg:flex-1">
                      <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-gray-900 truncate">
                        {booking.user?.name || "Customer"}
                      </h3>

                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-blue-600 font-medium break-words">
                        {booking.service}
                      </p>

                      <p className="mt-1 sm:mt-2 text-[9px] sm:text-xs lg:text-sm text-gray-500 break-words">
                        📞 {booking.user?.phone || "Phone not available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-5 min-w-0 lg:min-w-[520px]">
                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                          Date
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs lg:text-sm font-medium text-gray-900 truncate">
                          {new Date(
                            booking.date
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                          Time
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs lg:text-sm font-medium text-gray-900 truncate">
                          {booking.time}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                          Price
                        </p>

                        <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs lg:text-sm font-bold text-gray-900 truncate">
                          ₹{booking.price}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                          Status
                        </p>

                        <span
                          className={`inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[9px] lg:text-xs font-medium max-w-full truncate ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : booking.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 min-w-0">
                    <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500">
                      Service Address
                    </p>

                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-700 break-words leading-relaxed">
                      {booking.address}, {booking.city} - {booking.pincode}
                    </p>
                  </div>

                  {booking.description && (
                    <div className="mt-2 sm:mt-3 min-w-0">
                      <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500">
                        Customer's Problem
                      </p>

                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-700 break-words leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;