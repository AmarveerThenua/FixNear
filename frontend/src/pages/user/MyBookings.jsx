import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../../utils/bookingStorage";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  return (
    <section>

      {/* Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage all your service bookings.
        </p>

      </div>


      {/* Empty State */}
      {bookings.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

          <div className="text-5xl mb-4">
            📅
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No Bookings Yet
          </h2>

          <p className="mt-2 text-gray-500">
            You haven't booked any service yet.
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Find Professionals
          </Link>

        </div>

      ) : (

        <div className="space-y-4">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                {/* Information */}
                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.service}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Professional: {booking.professional}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                    <span>
                      📅 {booking.date}
                    </span>

                    <span>
                      🕐 {booking.time}
                    </span>

                    <span>
                      💰 ₹{booking.price}
                    </span>

                  </div>

                </div>


                {/* Status + View */}
                <div className="flex items-center gap-4">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <Link
                    to={`/booking/${booking.id}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
};

export default MyBookings;