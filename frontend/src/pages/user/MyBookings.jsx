import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          `${import.meta.env.VITE_API_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Fetch bookings error:", error);

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

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-6 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-600">
            Loading your bookings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-5 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 md:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
            View and manage your service bookings.
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm md:text-base text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
              📅
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              No Bookings Yet
            </h2>

            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-500">
              You haven't booked a professional yet.
            </p>

            <Link
              to="/professionals"
              className="inline-block mt-4 sm:mt-5 md:mt-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Find a Professional
            </Link>
          </div>
        )}

        {!error && bookings.length > 0 && (
          <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {bookings.map((booking) => {
              const professional = booking.professional;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-4 lg:p-5 min-w-0 flex flex-col"
                >
                  <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-2 sm:gap-3 min-w-0">
                    {professional?.image ? (
                      <img
                        src={professional.image}
                        alt={professional.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 flex items-center justify-center text-base sm:text-xl shrink-0">
                        👤
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                        {professional?.name || "Professional"}
                      </h2>

                      <p className="text-blue-600 text-[9px] sm:text-xs lg:text-sm font-medium mt-0.5 truncate">
                        {professional?.profession || booking.service}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-3">
                    <span
                      className={`inline-flex max-w-full px-2 py-1 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-medium ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      <span className="truncate">
                        {getFormattedStatus(booking.status)}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500">
                        Date
                      </p>

                      <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-900 truncate">
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
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500">
                        Time
                      </p>

                      <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-900 truncate">
                        {booking.time}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500">
                        Service
                      </p>

                      <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-900 truncate">
                        {booking.service}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500">
                        Price
                      </p>

                      <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-bold text-gray-900 truncate">
                        ₹{booking.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500">
                      Service Address
                    </p>

                    <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm text-gray-700 break-words leading-relaxed line-clamp-3">
                      {booking.address}
                      {booking.city ? `, ${booking.city}` : ""}
                      {booking.pincode ? ` - ${booking.pincode}` : ""}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-4">
                    <Link
                      to={`/booking/${booking._id}`}
                      className="flex items-center justify-center w-full px-2 py-2 sm:px-3 sm:py-2.5 border border-blue-600 text-blue-600 text-[10px] sm:text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-50 transition"
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