import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarCheck,
  faCalendarXmark,
  faCircleCheck,
  faStar,
  faTrash,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

const ProfessionalNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("fixnearToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("fixnearToken");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("fixnearToken");

    try {
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
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const deleteNotification = async (notificationId) => {
    const token = localStorage.getItem("fixnearToken");

    try {
      const notification = notifications.find(
        (item) => item._id === notificationId
      );

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== notificationId
        )
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) =>
          Math.max(prev - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_booking":
        return faCalendarCheck;
      case "booking_accepted":
        return faCircleCheck;
      case "booking_rejected":
        return faCalendarXmark;
      case "booking_completed":
        return faCircleCheck;
      case "booking_cancelled":
        return faCalendarXmark;
      case "new_review":
        return faStar;
      default:
        return faBell;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1 leading-relaxed">
            Stay updated with your bookings and account activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="self-start bg-red-50 text-red-600 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap">
            {unreadCount} unread
          </div>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="mb-4 sm:mb-5">
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            Mark all as read
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <p className="text-sm sm:text-base text-gray-500">
            Loading notifications...
          </p>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
            <FontAwesomeIcon
              icon={faBell}
              className="text-gray-400 text-xl sm:text-2xl"
            />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            No Notifications
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            You don't have any notifications yet.
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`
                bg-white
                rounded-xl
                shadow-sm
                p-3.5 sm:p-4 md:p-5
                border
                transition
                ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-blue-200 bg-blue-50/40"
                }
              `}
            >
              <div className="flex gap-3 sm:gap-4">
                <div
                  className={`
                    w-9 h-9
                    sm:w-11 sm:h-11
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    ${
                      notification.isRead
                        ? "bg-gray-100 text-gray-500"
                        : "bg-blue-100 text-blue-600"
                    }
                  `}
                >
                  <FontAwesomeIcon
                    icon={getNotificationIcon(
                      notification.type
                    )}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <h3
                        className={`
                          text-sm sm:text-base
                          font-semibold
                          break-words
                          ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }
                        `}
                      >
                        {notification.title}
                      </h3>

                      <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed break-words">
                        {notification.message}
                      </p>

                      <p className="text-gray-400 text-[11px] sm:text-xs mt-2">
                        {formatDate(
                          notification.createdAt
                        )}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5 sm:mt-2" />
                    )}
                  </div>

                  {notification.booking && (
                    <div className="mt-3 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-2.5 sm:p-3 break-words">
                      <span className="font-medium">
                        Service:
                      </span>{" "}
                      {notification.booking.service}

                      {notification.booking.status && (
                        <>
                          {" • "}
                          <span className="capitalize">
                            {notification.booking.status}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 sm:mt-4">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition"
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
                      className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                      />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalNotifications;