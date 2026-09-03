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
  const [markingAll, setMarkingAll] = useState(false);

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
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("fixnearToken");

    if (!token) {
      return;
    }

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

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("fixnearToken");

    if (!token || unreadCount === 0) {
      return;
    }

    try {
      setMarkingAll(true);

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
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    const token = localStorage.getItem("fixnearToken");

    if (!token) {
      return;
    }

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
        prev.filter((item) => item._id !== notificationId)
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
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
    <div className="p-2 sm:p-3 md:p-5 lg:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-5 lg:mb-6">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
              Notifications
            </h1>

            <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
              Stay updated with your bookings and account activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="shrink-0 bg-red-50 text-red-600 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[8px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">
              {unreadCount} unread
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="mb-3 sm:mb-4">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed rounded-md sm:rounded-lg text-[9px] sm:text-xs lg:text-sm font-medium transition"
            >
              <FontAwesomeIcon
                icon={faCheckDouble}
                className="text-[9px] sm:text-xs"
              />

              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8 text-center">
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className="w-7 h-7 sm:w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>

            <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500">
              Loading notifications...
            </p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8 lg:p-10 text-center">
            <div className="w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2 sm:mb-3">
              <FontAwesomeIcon
                icon={faBell}
                className="text-gray-400 text-base sm:text-xl"
              />
            </div>

            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              No Notifications
            </h3>

            <p className="text-gray-500 text-[9px] sm:text-xs lg:text-sm mt-1">
              You don't have any notifications yet.
            </p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg sm:rounded-xl shadow-sm p-2.5 sm:p-3 md:p-4 lg:p-5 border transition ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-blue-200 bg-blue-50/40"
                }`}
              >
                <div className="flex gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.isRead
                        ? "bg-gray-100 text-gray-500"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={getNotificationIcon(notification.type)}
                      className="text-[10px] sm:text-xs md:text-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold break-words leading-tight ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <p className="text-gray-600 text-[9px] sm:text-xs lg:text-sm mt-1 leading-relaxed break-words">
                          {notification.message}
                        </p>

                        <p className="text-gray-400 text-[8px] sm:text-[10px] lg:text-xs mt-1.5 sm:mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>

                    {notification.booking && (
                      <div className="mt-2 sm:mt-3 text-[9px] sm:text-xs lg:text-sm text-gray-500 bg-gray-50 rounded-md sm:rounded-lg p-2 sm:p-2.5 break-words">
                        <span className="font-medium">Service:</span>{" "}
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

                    <div className="flex items-center gap-3 sm:gap-4 mt-2.5 sm:mt-3">
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification._id)
                          }
                          className="min-h-8 sm:min-h-9 px-2 sm:px-2.5 text-[9px] sm:text-xs lg:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium transition"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(notification._id)
                        }
                        className="min-h-8 sm:min-h-9 px-2 text-[9px] sm:text-xs lg:text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md font-medium flex items-center gap-1 transition"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-[8px] sm:text-[10px]"
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
    </div>
  );
};

export default ProfessionalNotifications;