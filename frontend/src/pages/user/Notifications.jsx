import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("fixnearToken");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const deletedNotification =
        notifications.find(
          (notification) =>
            notification._id === id
        );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== id
        )
      );

      if (
        deletedNotification &&
        !deletedNotification.isRead
      ) {
        setUnreadCount((prev) =>
          Math.max(prev - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_accepted":
        return "✅";

      case "booking_rejected":
        return "❌";

      case "booking_completed":
        return "🎉";

      case "booking_cancelled":
        return "⚠️";

      case "new_review":
        return "⭐";

      case "new_booking":
        return "📅";

      default:
        return "🔔";
    }
  };

  const formatTime = (date) => {
    const notificationDate = new Date(date);

    return notificationDate.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <section className="min-h-[400px] flex items-center justify-center px-4 py-10">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading notifications...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="px-2.5 sm:px-3 py-1 bg-blue-600 text-white text-[11px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
                {unreadCount} New
              </span>
            )}
          </div>

          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Stay updated with your bookings and services.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="w-full sm:w-auto px-4 py-2.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm sm:text-base text-red-600 break-words">
            {error}
          </p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-7 sm:p-10 md:p-12 text-center">
          <div className="text-4xl sm:text-5xl mb-4">
            🔔
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            No Notifications
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
            You're all caught up! New updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-xl border p-4 sm:p-5 transition ${
                notification.isRead
                  ? "border-gray-200"
                  : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full flex items-center justify-center text-base sm:text-lg ${
                    notification.isRead
                      ? "bg-gray-100"
                      : "bg-blue-100"
                  }`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <h2 className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                        {notification.title}
                      </h2>

                      {!notification.isRead && (
                        <span className="w-2 h-2 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                      )}
                    </div>

                    <span className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(
                        notification.createdAt
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
                    {notification.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                      className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium"
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
    </section>
  );
};

export default Notifications;