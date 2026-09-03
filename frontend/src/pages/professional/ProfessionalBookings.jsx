import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfessionalBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("fixnearToken");



  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/professional",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(
        "Failed to fetch booking requests:",
        error.response?.data || error.message
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
      setUpdatingId(bookingId);

      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

   
      await fetchBookings();
    } catch (error) {
      console.error(
        "Failed to update booking status:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update booking status"
      );
    } finally {
      setUpdatingId(null);
    }
  };



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

  

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center min-h-60 sm:min-h-75">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
     

      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Booking Requests
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Manage booking requests from your customers.
        </p>
      </div>

      

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 text-center">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
            📭
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            No Booking Requests
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            You don't have any booking requests yet.
          </p>
        </div>
      ) : (
       

        <div className="space-y-4 sm:space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6"
            >
           

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                    {booking.service}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500 mt-1 break-words">
                    Customer:{" "}
                    <span className="font-medium text-gray-700">
                      {booking.user?.name ||
                        "Unknown Customer"}
                    </span>
                  </p>
                </div>

            

                <span
                  className={`self-start px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold capitalize whitespace-nowrap ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

            

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 sm:mt-6">
                {/* Phone */}

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Phone
                  </p>

                  <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
                    {booking.user?.phone ||
                      "Not provided"}
                  </p>
                </div>

            

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Date
                  </p>

                  <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5">
                    {new Date(
                      booking.date
                    ).toLocaleDateString()}
                  </p>
                </div>

          

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Time
                  </p>

                  <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
                    {booking.time}
                  </p>
                </div>

                

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Price
                  </p>

                  <p className="font-semibold text-sm sm:text-base text-green-600 mt-0.5">
                    ₹{booking.price}
                  </p>
                </div>
              </div>

              
              <div className="mt-5">
                <p className="text-xs sm:text-sm text-gray-400">
                  Address
                </p>

                <p className="text-sm sm:text-base text-gray-700 mt-0.5 break-words leading-relaxed">
                  {booking.address}
                  {booking.city
                    ? `, ${booking.city}`
                    : ""}
                  {booking.pincode
                    ? ` - ${booking.pincode}`
                    : ""}
                </p>
              </div>

             

              {booking.description && (
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Description
                  </p>

                  <p className="text-sm sm:text-base text-gray-700 mt-0.5 break-words leading-relaxed">
                    {booking.description}
                  </p>
                </div>
              )}

              

              {booking.status === "pending" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 sm:mt-6">
                  {/* Accept */}

                  <button
                    type="button"
                    disabled={
                      updatingId === booking._id
                    }
                    onClick={() =>
                      updateBookingStatus(
                        booking._id,
                        "confirmed"
                      )
                    }
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {updatingId === booking._id
                      ? "Updating..."
                      : "Accept"}
                  </button>

              

                  <button
                    type="button"
                    disabled={
                      updatingId === booking._id
                    }
                    onClick={() =>
                      updateBookingStatus(
                        booking._id,
                        "cancelled"
                      )
                    }
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {updatingId === booking._id
                      ? "Updating..."
                      : "Reject"}
                  </button>
                </div>
              )}

             

              {booking.status === "confirmed" && (
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={
                      updatingId === booking._id
                    }
                    onClick={() =>
                      updateBookingStatus(
                        booking._id,
                        "completed"
                      )
                    }
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {updatingId === booking._id
                      ? "Completing..."
                      : "Complete Service"}
                  </button>
                </div>
              )}

              

              {booking.status === "completed" && (
                <div className="mt-5 sm:mt-6">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm sm:text-base font-medium">
                    ✓ Service Completed
                  </div>
                </div>
              )}

       

              {booking.status === "cancelled" && (
                <div className="mt-5 sm:mt-6">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base font-medium">
                    ✕ Booking Cancelled
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalBookings;