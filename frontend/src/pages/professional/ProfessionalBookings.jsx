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
    <section className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Booking Requests
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage your customer booking requests and services.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 break-words">
              {success}
            </p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500">
              Loading booking requests...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📅</div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              No Booking Requests
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              You don't have any booking requests yet. New customer
              requests will appear here.
            </p>

            <button
              type="button"
              onClick={fetchBookings}
              className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">
                        👤
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 break-words">
                          {booking.user?.name || "Customer"}
                        </h2>

                        <p className="text-sm text-gray-500 break-words">
                          {booking.user?.email || "Email not available"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`self-start px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Service
                      </p>

                      <p className="text-sm font-semibold text-gray-900 break-words">
                        {booking.service || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Booking Date
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(booking.date)}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Booking Time
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {booking.time || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Price
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        ₹{booking.price ?? 0}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-gray-900 break-words">
                        {booking.user?.phone || "Not available"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        City
                      </p>

                      <p className="text-sm font-semibold text-gray-900 break-words">
                        {booking.city || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">
                      Service Address
                    </p>

                    <p className="text-sm text-gray-800 break-words">
                      {booking.address || "Address not available"}
                    </p>

                    {booking.pincode && (
                      <p className="mt-1 text-sm text-gray-600">
                        Pincode: {booking.pincode}
                      </p>
                    )}
                  </div>

                  {booking.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Customer Description
                      </p>

                      <p className="text-sm text-gray-800 break-words leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  )}

                  {booking.status === "pending" && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "confirmed"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="flex-1 px-5 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
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
                        className="flex-1 px-5 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading ===
                        `${booking._id}-cancelled`
                          ? "Rejecting..."
                          : "Reject Booking"}
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "completed"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="w-full px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
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