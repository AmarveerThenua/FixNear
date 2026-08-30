import React from "react";
import { Link, useParams } from "react-router-dom";

const BookingDetails = () => {

  const { id } = useParams();

  const bookings = [
    {
      id: 1,
      service: "Plumbing",
      professional: "Rahul Sharma",
      date: "28 August 2026",
      time: "10:00 AM",
      price: 500,
      status: "Confirmed",
      location: "Sector 62, Noida"
    },
    {
      id: 2,
      service: "Electrical Repair",
      professional: "Amit Kumar",
      date: "30 August 2026",
      time: "02:00 PM",
      price: 700,
      status: "Pending",
      location: "Sector 63, Noida"
    },
    {
      id: 3,
      service: "Home Painting",
      professional: "Vikas Singh",
      date: "2 September 2026",
      time: "11:00 AM",
      price: 2500,
      status: "Completed",
      location: "Sector 18, Noida"
    }
  ];

  const booking = bookings.find(
    (item) => item.id === Number(id)
  );

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Booking Not Found
          </h1>

          <Link
            to="/my-bookings"
            className="inline-block mt-5 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Bookings
          </Link>

        </div>

      </div>
    );
  }

  return (
    <section>

      {/* Header */}
      <div className="mb-8">

        <Link
          to="/my-bookings"
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to My Bookings
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Booking Details
        </h1>

        <p className="mt-2 text-gray-600">
          View complete information about your booking.
        </p>

      </div>


      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">

        {/* Service */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-gray-200">

          <div>

            <p className="text-sm text-gray-500">
              Service
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {booking.service}
            </h2>

          </div>

          <span
            className={`inline-block w-fit px-4 py-2 rounded-full text-sm font-medium ${
              booking.status === "Confirmed"
                ? "bg-green-100 text-green-700"
                : booking.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {booking.status}
          </span>

        </div>


        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">

          <div>
            <p className="text-sm text-gray-500">
              Professional
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {booking.professional}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Booking ID
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              #{booking.id}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              📅 {booking.date}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Time
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              🕐 {booking.time}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Service Location
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              📍 {booking.location}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Total Price
            </p>

            <p className="mt-1 text-xl font-bold text-blue-600">
              ₹{booking.price}
            </p>
          </div>

        </div>


        {/* Actions */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">

          <Link
            to={`/professionals/${booking.id}`}
            className="px-5 py-3 text-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            View Professional
          </Link>

          {booking.status !== "Completed" && (
            <button
              className="px-5 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Cancel Booking
            </button>
          )}

        </div>

      </div>

    </section>
  );
};

export default BookingDetails;