import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfessionalBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        navigate("/login");
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
      console.error("Failed to fetch professional bookings:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("fixnearToken");
        localStorage.removeItem("fixnearUser");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load booking requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setActionLoading(`${bookingId}-${status}`);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message || "Booking status updated successfully."
      );

      await fetchBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);

      setError(
        error.response?.data?.message ||
        "Unable to update booking status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .split("-")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <section className="min-h-screen bg-gray-50 px-2.5 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-7 lg:py-10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto min-w-0">
        <div className="mb-5 sm:mb-7 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Booking Requests
          </h1>

          <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-base text-gray-600">
            Manage your customer booking requests and services.
          </p>
        </div>

        {error && (
          <div className="mb-3 sm:mb-5 p-2.5 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs lg:text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-3 sm:mb-5 p-2.5 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs lg:text-sm text-green-600 break-words">
              {success}
            </p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 p-6 sm:p-10 lg:p-12 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

            <p className="mt-3 sm:mt-4 text-[10px] sm:text-sm text-gray-500">
              Loading booking requests...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 p-6 sm:p-10 lg:p-12 text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">
              📅
            </div>

            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              No Booking Requests
            </h2>

            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs lg:text-base text-gray-500 max-w-md mx-auto">
              You don't have any booking requests yet. New customer
              requests will appear here.
            </p>

            <button
              type="button"
              onClick={fetchBookings}
              className="mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white text-[10px] sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-w-0"
              >
                <div className="p-2.5 sm:p-4 md:p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-4 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm sm:text-lg lg:text-xl shrink-0">
                        👤
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xs sm:text-sm lg:text-lg font-semibold text-gray-900 truncate">
                          {booking.user?.name || "Customer"}
                        </h2>

                        <p className="text-[8px] sm:text-[10px] lg:text-sm text-gray-500 truncate">
                          {booking.user?.email || "Email not available"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 px-1.5 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] lg:text-sm font-semibold whitespace-nowrap ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-5 lg:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3 lg:gap-4">
                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Service
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                        {booking.service || "Not specified"}
                      </p>
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Booking Date
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                        {formatDate(booking.date)}
                      </p>
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Booking Time
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                        {booking.time || "Not specified"}
                      </p>
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Price
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                        ₹{booking.price ?? 0}
                      </p>
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Phone
                      </p>

                      {booking.user?.phone ? (
                        <a
                          href={`tel:${booking.user.phone}`}
                          className="text-[9px] sm:text-xs lg:text-sm font-semibold text-blue-600 hover:text-blue-700 truncate block"
                        >
                          📞 {booking.user.phone}
                        </a>
                      ) : (
                        <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                          Not available
                        </p>
                      )}
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        City
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                        {booking.city || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-4 p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                    <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                      Service Address
                    </p>

                    <p className="text-[9px] sm:text-xs lg:text-sm text-gray-800 break-words leading-relaxed">
                      {booking.address || "Address not available"}
                    </p>

                    {booking.pincode && (
                      <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs lg:text-sm text-gray-600">
                        Pincode: {booking.pincode}
                      </p>
                    )}
                  </div>

                  {booking.description && (
                    <div className="mt-2 sm:mt-4 p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-md sm:rounded-xl min-w-0">
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mb-0.5 sm:mb-1">
                        Customer Description
                      </p>

                      <p className="text-[9px] sm:text-xs lg:text-sm text-gray-800 break-words leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  )}

                  {booking.status === "pending" && (
                    <div className="mt-3 sm:mt-5 flex flex-row gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "confirmed"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="flex-1 px-2 sm:px-5 py-2 sm:py-3 bg-green-600 text-white text-[9px] sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading ===
                          `${booking._id}-confirmed`
                          ? "Accepting..."
                          : "Accept Booking"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "cancelled"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="flex-1 px-2 sm:px-5 py-2 sm:py-3 bg-red-600 text-white text-[9px] sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading ===
                          `${booking._id}-cancelled`
                          ? "Rejecting..."
                          : "Reject Booking"}
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="mt-3 sm:mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "completed"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="w-full px-3 sm:px-5 py-2 sm:py-3 bg-blue-600 text-white text-[9px] sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading ===
                          `${booking._id}-completed`
                          ? "Completing..."
                          : "Mark Service as Completed"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessionalBookings;