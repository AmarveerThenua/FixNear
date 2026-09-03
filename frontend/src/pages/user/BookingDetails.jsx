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

  // =========================
  // Fetch Booking
  // =========================

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
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Booking Details:",
          response.data.booking
        );

        setBooking(response.data.booking);
      } catch (error) {
        console.error(
          "Fetch booking error:",
          error
        );

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

  // =========================
  // Cancel Booking
  // =========================

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

      const token = localStorage.getItem(
        "fixnearToken"
      );

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Cancel Booking:",
        response.data
      );

      setBooking(response.data.booking);
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading booking...
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // Error / Not Found
  // =========================

  if (error && !booking) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Booking Not Found
          </h1>

          <p className="mt-2 text-sm sm:text-base text-red-500 break-words">
            {error}
          </p>

          <Link
            to="/my-bookings"
            className="inline-block mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
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

  // =========================
  // Status Classes
  // =========================

  const getStatusClass = () => {
    switch (booking.status) {
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

  const formattedStatus =
    booking.status
      ?.charAt(0)
      .toUpperCase() +
    booking.status?.slice(1);

  return (
    <section className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 md:px-6">
        {/* Back */}

        <Link
          to="/my-bookings"
          className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 transition"
        >
          ← Back to My Bookings
        </Link>

        {/* =========================
            Header
        ========================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-5 sm:mt-6">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Booking Details
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-gray-500 break-all">
              Booking ID: {booking._id}
            </p>
          </div>

          {/* Status */}

          <span
            className={`inline-block w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass()}`}
          >
            {formattedStatus}
          </span>
        </div>

        {/* =========================
            Error
        ========================= */}

        {error && (
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            Professional
        ========================= */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mt-5 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
            Professional
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {professional?.image ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                👤
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                {professional?.name ||
                  "Professional"}
              </h3>

              <p className="text-sm sm:text-base text-blue-600 font-medium mt-0.5 break-words">
                {professional?.profession ||
                  booking.service}
              </p>

              {professional?.phone && (
                <p className="mt-1 text-sm sm:text-base text-gray-500 break-words">
                  📞 {professional.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Service Details
        ========================= */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mt-5 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
            Service Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Service */}

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Service
              </p>

              <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                {booking.service}
              </p>
            </div>

            {/* Price */}

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Price
              </p>

              <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                ₹{booking.price}
              </p>
            </div>

            {/* Date */}

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Date
              </p>

              <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                {new Date(
                  booking.date
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Time */}

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Time
              </p>

              <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                {booking.time}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            Service Address
        ========================= */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mt-5 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
            Service Address
          </h2>

          <p className="text-sm sm:text-base text-gray-700 break-words leading-relaxed">
            {booking.address}
          </p>

          <p className="mt-1 text-sm sm:text-base text-gray-600 break-words">
            {booking.city}
            {booking.pincode
              ? ` - ${booking.pincode}`
              : ""}
          </p>
        </div>

        {/* =========================
            Problem Description
        ========================= */}

        {booking.description && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mt-5 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Problem Description
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
              {booking.description}
            </p>
          </div>
        )}

        {/* =========================
            Actions
        ========================= */}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/my-bookings"
            className="w-full sm:flex-1 py-3 text-center border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Back to My Bookings
          </Link>

          {/* Cancel */}

          {booking.status !== "cancelled" &&
            booking.status !== "completed" && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full sm:flex-1 py-3 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;