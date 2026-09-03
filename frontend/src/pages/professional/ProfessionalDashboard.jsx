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

        console.log(
          "Professional Bookings:",
          response.data.bookings
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error(
          "Fetch professional bookings error:",
          error
        );

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
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading your bookings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Professional Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your customer bookings and services.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {bookings.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                bookings.filter(
                  (booking) =>
                    booking.status === "pending"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                bookings.filter(
                  (booking) =>
                    booking.status === "confirmed"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                bookings.filter(
                  (booking) =>
                    booking.status === "completed"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Customer Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">
                📅
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                No Bookings Yet
              </h3>

              <p className="mt-2 text-gray-500">
                Customer bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-6 hover:bg-gray-50 transition min-w-0 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 min-w-0">
                    <div className="min-w-0 lg:flex-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {booking.user?.name || "Customer"}
                      </h3>

                      <p className="mt-1 text-blue-600 font-medium break-words">
                        {booking.service}
                      </p>

                      <p className="mt-2 text-sm text-gray-500 break-words">
                        📞{" "}
                        {booking.user?.phone ||
                          "Phone not available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Date
                        </p>

                        <p className="mt-1 font-medium text-gray-900 whitespace-nowrap">
                          {new Date(
                            booking.date
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Time
                        </p>

                        <p className="mt-1 font-medium text-gray-900 break-words">
                          {booking.time}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Price
                        </p>

                        <p className="mt-1 font-bold text-gray-900 whitespace-nowrap">
                          ₹{booking.price}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Status
                        </p>

                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium max-w-full ${
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

                  <div className="mt-5 pt-5 border-t border-gray-100 min-w-0">
                    <p className="text-sm text-gray-500">
                      Service Address
                    </p>

                    <p className="mt-1 text-gray-700 break-words overflow-hidden">
                      {booking.address},{" "}
                      {booking.city} -{" "}
                      {booking.pincode}
                    </p>
                  </div>

                  {booking.description && (
                    <div className="mt-4 min-w-0">
                      <p className="text-sm text-gray-500">
                        Customer's Problem
                      </p>

                      <p className="mt-1 text-gray-700 break-words overflow-hidden">
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