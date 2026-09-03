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
        `${import.meta.env.VITE_API_URL}/notifications`,
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
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`,
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
            ? { ...notification, isRead: true }
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
        `${import.meta.env.VITE_API_URL}/notifications/read-all`,
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
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}`,
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
            `${import.meta.env.VITE_API_URL}/notifications/${notification._id}`,
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
          word.charAt(0).toUpperCase() + word.slice(1)
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
    <div className="space-y-3 sm:space-y-6 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Admin Notifications
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            View and manage your FixNear notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchNotifications}
          className="shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-blue-600 text-white text-[10px] sm:text-sm rounded-lg hover:bg-blue-700 transition"
        >
          🔄 <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500 leading-tight">
            Total
          </p>

          <h2 className="text-lg sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
            {totalNotifications}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500 leading-tight">
            Unread
          </p>

          <h2 className="text-lg sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">
            {unreadNotifications}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500 leading-tight">
            Read
          </p>

          <h2 className="text-lg sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
            {readNotifications}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              flex-1
              px-3
              py-2
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
              text-xs
              sm:text-sm
            "
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              w-full
              sm:w-auto
              px-3
              py-2
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
              text-xs
              sm:text-sm
              bg-white
            "
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadNotifications === 0}
          className="
            px-3
            py-2
            bg-green-600
            text-white
            text-xs
            rounded-lg
            hover:bg-green-700
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Mark All Read
        </button>

        <button
          type="button"
          onClick={clearReadNotifications}
          disabled={readNotifications === 0}
          className="
            px-3
            py-2
            bg-gray-800
            text-white
            text-xs
            rounded-lg
            hover:bg-gray-900
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Clear Read
        </button>

        <div className="hidden sm:block" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs sm:text-sm break-words">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-10 text-center">
          <p className="text-xs sm:text-base text-gray-500">
            Loading notifications...
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-10 text-center">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
            🔔
          </div>

          <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
            No notifications found
          </h3>

          <p className="text-[10px] sm:text-sm text-gray-500 mt-1">
            You don't have any notifications matching this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg sm:rounded-xl border p-2.5 sm:p-5 transition ${
                notification.isRead
                  ? "border-gray-200"
                  : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex items-start gap-2.5 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-xl shrink-0 ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-start gap-1.5">
                        <h3 className="font-semibold text-gray-800 text-xs sm:text-base break-words">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>

                      <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 break-words">
                        {formatType(notification.type)}
                        {" • "}
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="text-[8px] sm:text-xs font-medium text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shrink-0">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] sm:text-sm text-gray-600 mt-2 sm:mt-3 leading-4 sm:leading-6 break-words">
                    {notification.message}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-4">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs font-medium text-green-600 bg-green-50 rounded-md sm:rounded-lg hover:bg-green-100 transition"
                      >
                        Mark as Read
                      </button>
                    )}

                    {notification.booking && (
                      <span className="max-w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs text-gray-500 bg-gray-100 rounded-md sm:rounded-lg break-all">
                        Booking:{" "}
                        {typeof notification.booking === "object"
                          ? notification.booking._id
                          : notification.booking}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs font-medium text-red-600 bg-red-50 rounded-md sm:rounded-lg hover:bg-red-100 transition"
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

      {!loading && filteredNotifications.length > 0 && (
        <div className="text-[10px] sm:text-sm text-gray-500 text-center px-2">
          Showing {filteredNotifications.length} of{" "}
          {notifications.length} notifications
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;