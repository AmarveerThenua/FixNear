import React, { useEffect, useState } from "react";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const token = localStorage.getItem("fixnearToken");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((booking) => {
        return (
          booking.service?.toLowerCase().includes(searchValue) ||
          booking.city?.toLowerCase().includes(searchValue) ||
          booking.user?.name?.toLowerCase().includes(searchValue) ||
          booking.user?.email?.toLowerCase().includes(searchValue) ||
          booking.professional?.name?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (booking) => booking.status === statusFilter
      );
    }

    setFilteredBookings(result);
  }, [bookings, search, statusFilter]);

  const updateStatus = async (bookingId, status) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to change this booking status to "${status}"?`
    );

    if (!confirmUpdate) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/admin/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      await fetchBookings();

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(data.booking);
      }

      alert("Booking status updated successfully.");
    } catch (error) {
      console.error("Update status error:", error);
      alert(error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/admin/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking");
      }

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );

      setSelectedBooking(null);
      setShowDetails(false);

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Delete booking error:", error);
      alert(error.message);
    }
  };

  const viewBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/admin/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch booking");
      }

      setSelectedBooking(data.booking);
      setShowDetails(true);
    } catch (error) {
      console.error("View booking error:", error);
      alert(error.message);
    }
  };

  const getStatusStyle = (status) => {
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

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCreatedDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="space-y-3 sm:space-y-6 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Manage Bookings
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            View and manage all FixNear service bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBookings}
          className="shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-blue-600 text-white text-[10px] sm:text-sm rounded-lg hover:bg-blue-700 transition"
        >
          🔄 <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Total Bookings
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">
            {totalBookings}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Pending
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-yellow-600 mt-1 sm:mt-2">
            {pendingBookings}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Confirmed
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-blue-600 mt-1 sm:mt-2">
            {confirmedBookings}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Completed
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-green-600 mt-1 sm:mt-2">
            {completedBookings}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs sm:text-sm break-words">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-10 text-center">
          <p className="text-xs sm:text-base text-gray-500">
            Loading bookings...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-10 text-center">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
            📋
          </div>

          <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
            No bookings found
          </h3>

          <p className="text-[10px] sm:text-sm text-gray-500 mt-1">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <>
          <div className="lg:hidden space-y-2.5">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {booking.service || "Service"}
                    </p>

                    <p className="text-[9px] text-gray-400 mt-0.5 break-all">
                      ID: {booking._id}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-[9px] font-semibold capitalize shrink-0 ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status?.replace("-", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase font-medium text-gray-400">
                      Customer
                    </p>

                    <p className="text-[10px] font-medium text-gray-800 truncate mt-0.5">
                      {booking.user?.name || "N/A"}
                    </p>

                    <p className="text-[9px] text-gray-500 truncate">
                      {booking.user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] uppercase font-medium text-gray-400">
                      Professional
                    </p>

                    <p className="text-[10px] font-medium text-gray-800 truncate mt-0.5">
                      {booking.professional?.name || "N/A"}
                    </p>

                    <p className="text-[9px] text-gray-500 truncate">
                      {booking.professional?.profession || ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5">
                  <div>
                    <p className="text-[8px] uppercase font-medium text-gray-400">
                      Date & Time
                    </p>

                    <p className="text-[10px] font-medium text-gray-800 mt-0.5">
                      {formatDate(booking.date)}
                    </p>

                    <p className="text-[9px] text-gray-500">
                      {booking.time || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase font-medium text-gray-400">
                      Price
                    </p>

                    <p className="text-[10px] font-semibold text-gray-800 mt-0.5">
                      ₹{booking.price || 0}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => viewBooking(booking._id)}
                    className="flex-1 px-2 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                  >
                    View
                  </button>

                  <select
                    value={booking.status}
                    onChange={(e) =>
                      updateStatus(booking._id, e.target.value)
                    }
                    className="flex-1 min-w-0 px-1.5 py-1.5 text-[9px] border border-gray-300 rounded-md outline-none bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteBooking(booking._id)}
                    className="flex-1 px-2 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Booking
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Professional
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Date & Time
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Price
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="max-w-45">
                          <p className="font-semibold text-gray-800 truncate">
                            {booking.service || "Service"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1 break-all">
                            ID: {booking._id}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {booking.user?.name || "N/A"}
                        </p>

                        <p className="text-xs text-gray-500 break-all">
                          {booking.user?.email || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {booking.professional?.name || "N/A"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.professional?.profession || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {formatDate(booking.date)}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {booking.time || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          ₹{booking.price || 0}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status?.replace("-", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            type="button"
                            onClick={() => viewBooking(booking._id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                          >
                            View
                          </button>

                          <select
                            value={booking.status}
                            onChange={(e) =>
                              updateStatus(
                                booking._id,
                                e.target.value
                              )
                            }
                            className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg outline-none bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">
                              In Progress
                            </option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              deleteBooking(booking._id)
                            }
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>

          <div className="lg:hidden text-center">
            <p className="text-[10px] text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        </>
      )}

      {showDetails && selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => {
            setShowDetails(false);
            setSelectedBooking(null);
          }}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-gray-800">
                  Booking Details
                </h2>

                <p className="text-[9px] sm:text-xs text-gray-500 mt-1 break-all">
                  {selectedBooking._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedBooking(null);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-sm text-gray-500">
                    Service
                  </p>

                  <h3 className="text-sm sm:text-lg font-bold text-gray-800 break-words">
                    {selectedBooking.service}
                  </h3>
                </div>

                <span
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[9px] sm:text-sm font-semibold capitalize shrink-0 ${getStatusStyle(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status?.replace("-", " ")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm">
                    Customer
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedBooking.user?.name || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1.5 break-all">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedBooking.user?.email || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1.5 break-words">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedBooking.user?.phone || "N/A"}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm">
                    Professional
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedBooking.professional?.name || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1.5 break-words">
                    <span className="font-medium">Profession:</span>{" "}
                    {selectedBooking.professional?.profession || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1.5 break-words">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedBooking.professional?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                  Booking Information
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Date
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                      {formatDate(selectedBooking.date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Time
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                      {selectedBooking.time || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Price
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                      ₹{selectedBooking.price || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Created
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1 break-words">
                      {formatCreatedDate(
                        selectedBooking.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm">
                  Service Address
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 break-words">
                  {selectedBooking.address || "N/A"}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                  {selectedBooking.city || ""}
                  {selectedBooking.city && selectedBooking.pincode
                    ? ", "
                    : ""}
                  {selectedBooking.pincode || ""}
                </p>
              </div>

              {selectedBooking.description && (
                <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm">
                    Description
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words leading-5">
                    {selectedBooking.description}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 sm:pt-5">
                <h3 className="font-semibold text-gray-800 mb-2.5 sm:mb-3 text-sm">
                  Admin Actions
                </h3>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedBooking._id,
                        "confirmed"
                      )
                    }
                    className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                  >
                    Confirm
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedBooking._id,
                        "in-progress"
                      )
                    }
                    className="px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition"
                  >
                    In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedBooking._id,
                        "completed"
                      )
                    }
                    className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                  >
                    Complete
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedBooking._id,
                        "cancelled"
                      )
                    }
                    className="px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteBooking(selectedBooking._id)
                    }
                    className="col-span-2 sm:col-span-1 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 transition"
                  >
                    Delete Booking
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedBooking(null);
                }}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;