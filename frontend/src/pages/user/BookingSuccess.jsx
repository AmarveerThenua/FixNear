import React from "react";
import { Link, useLocation } from "react-router-dom";

const BookingSuccess = () => {
  const location = useLocation();

  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Booking Information Not Found
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            We couldn't find the booking information for this page.
          </p>

          <Link
            to="/my-bookings"
            className="inline-block mt-5 px-5 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-[80vh] bg-gray-50 py-8 sm:py-12 md:py-16 px-3 sm:px-5 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 text-center">
          {/* Success Icon */}

          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl text-green-600">
              ✓
            </span>
          </div>

          {/* Heading */}

          <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>

          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">
            Your service has been booked successfully.
          </p>

          {/* =========================
              Booking ID
          ========================= */}

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <p className="text-xs sm:text-sm text-gray-500">
              Booking ID
            </p>

            <p className="mt-1 text-lg sm:text-xl font-bold text-gray-900 break-all">
              #{booking.id || booking._id}
            </p>
          </div>

          {/* =========================
              Details
          ========================= */}

          <div className="mt-5 sm:mt-6 text-left border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5">
              Booking Details
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Professional */}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-500">
                  Professional
                </span>

                <span className="font-medium text-sm sm:text-base text-gray-900 break-words sm:text-right">
                  {booking.professional}
                </span>
              </div>

              {/* Service */}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-500">
                  Service
                </span>

                <span className="font-medium text-sm sm:text-base text-gray-900 break-words sm:text-right">
                  {booking.service}
                </span>
              </div>

              {/* Date */}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-500">
                  Date
                </span>

                <span className="font-medium text-sm sm:text-base text-gray-900 sm:text-right">
                  {booking.date}
                </span>
              </div>

              {/* Time */}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-500">
                  Time
                </span>

                <span className="font-medium text-sm sm:text-base text-gray-900 sm:text-right">
                  {booking.time}
                </span>
              </div>

              {/* Price */}

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-gray-500">
                  Price
                </span>

                <span className="font-bold text-sm sm:text-base text-blue-600 whitespace-nowrap">
                  ₹{booking.price}
                </span>
              </div>
            </div>
          </div>

          {/* =========================
              Actions
          ========================= */}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            <Link
              to="/my-bookings"
              className="w-full sm:flex-1 py-3 text-center bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              My Bookings
            </Link>

            <Link
              to="/professionals"
              className="w-full sm:flex-1 py-3 text-center border border-gray-200 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Find More Professionals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSuccess;