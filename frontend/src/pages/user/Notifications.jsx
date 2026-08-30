import React, { useState } from "react";

const Notifications = () => {

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your plumbing booking with Rahul Sharma has been confirmed.",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Professional Arriving",
      message: "Amit Kumar will arrive at your location at 2:00 PM.",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Booking Completed",
      message: "Your home painting service has been completed.",
      time: "Yesterday",
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true
      }))
    );
  };

  return (
    <section>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-gray-600">
            Stay updated with your bookings and services.
          </p>

        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
        >
          Mark All as Read
        </button>

      </div>


      {/* Notifications */}
      <div className="space-y-4">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`bg-white rounded-xl border p-5 transition ${
              notification.read
                ? "border-gray-200"
                : "border-blue-200 bg-blue-50/30"
            }`}
          >

            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                🔔
              </div>


              {/* Content */}
              <div className="flex-1">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <h2 className="font-semibold text-gray-900">
                    {notification.title}
                  </h2>

                  <span className="text-xs text-gray-500">
                    {notification.time}
                  </span>

                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {notification.message}
                </p>


                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark as read
                  </button>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Notifications;