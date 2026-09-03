import React, { useEffect, useState } from "react";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fixnearToken");


  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch notifications"
        );
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

 
  useEffect(() => {
    let result = [...notifications];

    if (filter === "unread") {
      result = result.filter(
        (notification) => !notification.isRead
      );
    }

    if (filter === "read") {
      result = result.filter(
        (notification) => notification.isRead
      );
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((notification) => {
        return (
          notification.title
            ?.toLowerCase()
            .includes(searchValue) ||
          notification.message
            ?.toLowerCase()
            .includes(searchValue) ||
          notification.type
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    setFilteredNotifications(result);
  }, [notifications, filter, search]);



  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification"
        );
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification read error:", error);
      alert(error.message);
    }
  };



  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark all notifications"
        );
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark all notifications error:", error);
      alert(error.message);
    }
  };


  const deleteNotification = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete notification"
        );
      }

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Delete notification error:", error);
      alert(error.message);
    }
  };


  const clearReadNotifications = async () => {
    const readNotifications = notifications.filter(
      (notification) => notification.isRead
    );

    if (readNotifications.length === 0) {
      alert("There are no read notifications.");
      return;
    }

    const confirmClear = window.confirm(
      "Delete all read notifications?"
    );

    if (!confirmClear) return;

    try {
      await Promise.all(
        readNotifications.map((notification) =>
          fetch(
            `http://localhost:5000/api/notifications/${notification._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setNotifications((prev) =>
        prev.filter((notification) => !notification.isRead)
      );
    } catch (error) {
      console.error("Clear notifications error:", error);

      alert("Some notifications could not be deleted.");

      fetchNotifications();
    }
  };



  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_booking":
        return "📋";

      case "booking_accepted":
        return "✅";

      case "booking_rejected":
        return "❌";

      case "booking_completed":
        return "🎉";

      case "booking_cancelled":
        return "🚫";

      case "new_review":
        return "⭐";

      default:
        return "🔔";
    }
  };

 

  const getNotificationColor = (type) => {
    switch (type) {
      case "new_booking":
        return "bg-blue-100 text-blue-600";

      case "booking_accepted":
        return "bg-green-100 text-green-600";

      case "booking_rejected":
        return "bg-red-100 text-red-600";

      case "booking_completed":
        return "bg-green-100 text-green-600";

      case "booking_cancelled":
        return "bg-orange-100 text-orange-600";

      case "new_review":
        return "bg-yellow-100 text-yellow-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  const formatType = (type) => {
    if (!type) return "Notification";

    return type
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

 

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readNotifications = notifications.filter(
    (notification) => notification.isRead
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">

   
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Notifications
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            View and manage your FixNear notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-2 w-full lg:w-auto">

          <button
            onClick={fetchNotifications}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>

          <button
            onClick={markAllAsRead}
            disabled={unreadNotifications === 0}
            className="px-4 py-2.5 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>

          <button
            onClick={clearReadNotifications}
            disabled={readNotifications === 0}
            className="px-4 py-2.5 bg-gray-800 text-white text-sm sm:text-base rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Read
          </button>

        </div>

      </div>


  
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-500">
            Total Notifications
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
            {totalNotifications}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-500">
            Unread
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
            {unreadNotifications}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-500">
            Read
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
            {readNotifications}
          </h2>
        </div>

      </div>



      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">

        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">

          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full flex-1 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-auto px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
          >
            <option value="all">
              All Notifications
            </option>

            <option value="unread">
              Unread
            </option>

            <option value="read">
              Read
            </option>
          </select>

        </div>

      </div>


    

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base wrap-break-word">
          {error}
        </div>
      )}


    

      {loading ? (

        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-10 text-center">
          <p className="text-sm sm:text-base text-gray-500">
            Loading notifications...
          </p>
        </div>

      ) : filteredNotifications.length === 0 ? (

        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-10 text-center">

          <div className="text-4xl mb-3">
            🔔
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            No notifications found
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            You don't have any notifications matching this filter.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {filteredNotifications.map((notification) => (

            <div
              key={notification._id}
              className={`bg-white rounded-xl border p-3 sm:p-4 md:p-5 transition ${
                notification.isRead
                  ? "border-gray-200"
                  : "border-blue-200 bg-blue-50/30"
              }`}
            >

              <div className="flex items-start gap-3 sm:gap-4">

                {/* Icon */}

                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0 ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>


        

                <div className="flex-1 min-w-0">

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                    <div className="min-w-0">

                      <div className="flex items-start gap-2">

                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base wrap-break-word">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5" />
                        )}

                      </div>

                      <p className="text-[11px] sm:text-xs text-gray-400 mt-1 wrap-break-word">
                        {formatType(notification.type)}
                        {" • "}
                        {formatDate(notification.createdAt)}
                      </p>

                    </div>

                    {!notification.isRead && (
                      <span className="text-[11px] sm:text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit shrink-0">
                        Unread
                      </span>
                    )}

                  </div>


               
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-5 sm:leading-6 wrap-break-word">
                    {notification.message}
                  </p>


                  

                  <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">

                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
                      >
                        Mark as Read
                      </button>
                    )}

                    {notification.booking && (
                      <span className="max-w-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs text-gray-500 bg-gray-100 rounded-lg break-all">
                        Booking:{" "}
                        {typeof notification.booking === "object"
                          ? notification.booking._id
                          : notification.booking}
                      </span>
                    )}

                    <button
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}



      {!loading &&
        filteredNotifications.length > 0 && (
          <div className="text-xs sm:text-sm text-gray-500 text-center px-2">
            Showing {filteredNotifications.length} of{" "}
            {notifications.length} notifications
          </div>
        )}

    </div>
  );
};

export default AdminNotifications;