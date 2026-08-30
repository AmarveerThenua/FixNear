import React from "react";
import { Link, useLocation } from "react-router-dom";

const BookingSuccess = () => {

  const location = useLocation();

  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-gray-900">
            Booking Information Not Found
          </h1>

          <Link
            to="/my-bookings"
            className="inline-block mt-5 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to My Bookings
          </Link>

        </div>

      </div>
    );
  }

  return (
    <section className="min-h-[80vh] bg-gray-50 py-16 px-6">

      <div className="max-w-2xl mx-auto">

        {/* Success */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">

            <span className="text-4xl text-green-600">
              ✓
            </span>

          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>

          <p className="mt-3 text-gray-600">
            Your service has been booked successfully.
          </p>


          {/* Booking ID */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">

            <p className="text-sm text-gray-500">
              Booking ID
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              #{booking.id}
            </p>

          </div>


          {/* Details */}
          <div className="mt-6 text-left border border-gray-200 rounded-xl p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Booking Details
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Professional
                </span>

                <span className="font-medium text-gray-900">
                  {booking.professional}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Service
                </span>

                <span className="font-medium text-gray-900">
                  {booking.service}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-medium text-gray-900">
                  {booking.date}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Time
                </span>

                <span className="font-medium text-gray-900">
                  {booking.time}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Price
                </span>

                <span className="font-bold text-blue-600">
                  ₹{booking.price}
                </span>

              </div>

            </div>

          </div>


          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">

            <Link
              to="/my-bookings"
              className="flex-1 py-3 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              My Bookings
            </Link>

            <Link
              to="/professionals"
              className="flex-1 py-3 text-center border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
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