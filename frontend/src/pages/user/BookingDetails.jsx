import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("fixnearToken");

        if (!token) {
          setError("Please login to view this booking.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBooking(response.data.booking);
      } catch (error) {
        console.error("Fetch booking error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooking(response.data.booking);
    } catch (error) {
      console.error("Cancel booking error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  const getStatusClass = () => {
    switch (booking?.status) {
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

  if (loading) {
    return (
      <section className="h-[calc(100vh-110px)] min-h-[400px] bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-xs sm:text-sm text-gray-600">
            Loading booking...
          </p>
        </div>
      </section>
    );
  }

  if (error && !booking) {
    return (
      <section className="h-[calc(100vh-110px)] min-h-[400px] bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center max-w-md">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Booking Not Found
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-red-500 break-words">
            {error}
          </p>

          <Link
            to="/my-bookings"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Bookings
          </Link>
        </div>
      </section>
    );
  }

  if (!booking) {
    return null;
  }

  const professional = booking.professional;

  const formattedStatus =
    booking.status?.charAt(0).toUpperCase() +
    booking.status?.slice(1);

  return (
    <section className="min-h-[calc(100vh-110px)] bg-gray-50 py-3 sm:py-4 lg:py-5">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/my-bookings"
            className="text-[10px] sm:text-xs lg:text-sm text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
          >
            ← Back to My Bookings
          </Link>

          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap ${getStatusClass()}`}
          >
            {formattedStatus}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">
              Booking Details
            </h1>

            <p className="mt-0.5 text-[8px] sm:text-[10px] lg:text-xs text-gray-500 truncate">
              ID: {booking._id}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[10px] sm:text-xs text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mt-3 sm:mt-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-2 sm:mb-3">
              Professional
            </h2>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {professional?.image ? (
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 flex items-center justify-center text-base sm:text-xl shrink-0">
                  👤
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                  {professional?.name || "Professional"}
                </h3>

                <p className="text-[9px] sm:text-xs lg:text-sm text-blue-600 font-medium mt-0.5 truncate">
                  {professional?.profession || booking.service}
                </p>

                {professional?.phone && (
                  <p className="mt-0.5 text-[9px] sm:text-xs lg:text-sm text-gray-500 truncate">
                    📞 {professional.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-2 sm:mb-3">
              Service Details
            </h2>

            <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                  Service
                </p>

                <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                  {booking.service}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                  Price
                </p>

                <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                  ₹{booking.price}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                  Date
                </p>

                <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                  {new Date(booking.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">
                  Time
                </p>

                <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-900 truncate">
                  {booking.time}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">
              Service Address
            </h2>

            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-700 break-words leading-relaxed line-clamp-2">
              {booking.address}
            </p>

            <p className="mt-0.5 text-[9px] sm:text-xs lg:text-sm text-gray-600 break-words truncate">
              {booking.city}
              {booking.pincode ? ` - ${booking.pincode}` : ""}
            </p>
          </div>

          {booking.description && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
              <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">
                Problem Description
              </h2>

              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 leading-relaxed break-words line-clamp-3">
                {booking.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
          <Link
            to="/my-bookings"
            className="flex items-center justify-center py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-700 text-[10px] sm:text-xs lg:text-sm font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Back to Bookings
          </Link>

          {booking.status !== "cancelled" &&
            booking.status !== "completed" && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center justify-center py-2 sm:py-2.5 bg-red-600 text-white text-[10px] sm:text-xs lg:text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition"
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;