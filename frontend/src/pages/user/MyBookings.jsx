import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch My Bookings
  // =========================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("fixnearToken");

        if (!token) {
          setError("Please login to view your bookings.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "My Bookings:",
          response.data.bookings
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error(
          "Fetch bookings error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // =========================
  // Status Classes
  // =========================

  const getStatusClass = (status) => {
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

  const getFormattedStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-10 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-6 text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading your bookings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-7 sm:py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-6">
        {/* =========================
            Header
        ========================= */}

        <div className="mb-5 sm:mb-7 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
            View and manage your service bookings.
          </p>
        </div>

        {/* =========================
            Error
        ========================= */}

        {error && (
          <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm sm:text-base text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            Empty State
        ========================= */}

        {!error && bookings.length === 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-10 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">
              📅
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              No Bookings Yet
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-500">
              You haven't booked a professional yet.
            </p>

            <Link
              to="/professionals"
              className="inline-block mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Find a Professional
            </Link>
          </div>
        )}

        {/* =========================
            Booking List
        ========================= */}

        {!error && bookings.length > 0 && (
          <div className="space-y-4 sm:space-y-5">
            {bookings.map((booking) => {
              const professional =
                booking.professional;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6"
                >
                  {/* =========================
                      Booking Header
                  ========================= */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
                    {/* Professional */}

                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {professional?.image ? (
                        <img
                          src={professional.image}
                          alt={professional.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                          👤
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {professional?.name ||
                            "Professional"}
                        </h2>

                        <p className="text-blue-600 text-xs sm:text-sm font-medium mt-0.5 truncate">
                          {professional?.profession ||
                            booking.service}
                        </p>
                      </div>
                    </div>

                    {/* Status */}

                    <span
                      className={`self-start sm:self-auto inline-block w-fit px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {getFormattedStatus(
                        booking.status
                      )}
                    </span>
                  </div>

                  {/* =========================
                      Booking Information
                  ========================= */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                    {/* Date */}

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Date
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium text-gray-900">
                        {new Date(
                          booking.date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {/* Time */}

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Time
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium text-gray-900 break-words">
                        {booking.time}
                      </p>
                    </div>

                    {/* Service */}

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Service
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium text-gray-900 break-words">
                        {booking.service}
                      </p>
                    </div>

                    {/* Price */}

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Price
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-bold text-gray-900">
                        ₹{booking.price}
                      </p>
                    </div>
                  </div>

                  {/* =========================
                      Address
                  ========================= */}

                  <div className="mt-4 sm:mt-5">
                    <p className="text-xs text-gray-500">
                      Service Address
                    </p>

                    <p className="mt-1 text-sm sm:text-base text-gray-700 break-words leading-relaxed">
                      {booking.address}
                      {booking.city
                        ? `, ${booking.city}`
                        : ""}
                      {booking.pincode
                        ? ` - ${booking.pincode}`
                        : ""}
                    </p>
                  </div>

                  {/* =========================
                      View Details
                  ========================= */}

                  <div className="mt-4 sm:mt-5">
                    <Link
                      to={`/booking/${booking._id}`}
                      className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-blue-600 text-blue-600 text-sm sm:text-base font-medium rounded-lg hover:bg-blue-50 transition"
                    >
                      View Booking
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;