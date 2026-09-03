import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ProfessionalSidebar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      path: "/professional-dashboard",
      icon: "📊",
    },
    {
      name: "Booking Requests",
      path: "/professional-bookings",
      icon: "📅",
    },
    {
      name: "My Profile",
      path: "/professional-profile",
      icon: "👤",
    },
    {
      name: "Edit Profile",
      path: "/professional-profile/edit",
      icon: "✏️",
    },
    {
      name: "Reviews",
      path: "/professional-reviews",
      icon: "⭐",
    },
    {
      name: "Notifications",
      path: "/professional-notifications",
      icon: "🔔",
    },
  ];

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setUnreadCount(0);
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

        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-[60]
          w-10
          h-10
          flex
          items-center
          justify-center
          bg-white
          text-gray-700
          rounded-lg
          shadow-md
          border
          border-gray-200
          hover:bg-gray-50
          transition
        "
        aria-label="Open sidebar"
      >
        <FontAwesomeIcon
          icon={faBars}
          className="text-lg"
        />
      </button>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            lg:hidden
            fixed
            inset-0
            z-40
            bg-black/40
          "
        />
      )}

      <aside
        className={`
          fixed
          lg:static
          top-0
          left-0
          z-50
          h-screen
          lg:h-auto
          w-60
          lg:w-64
          bg-white
          border-r
          border-gray-200
          flex
          flex-col
          shrink-0
          shadow-xl
          lg:shadow-none
          transform
          transition-transform
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          lg:min-h-screen
        `}
      >
        <div
          className="
            px-4
            sm:px-5
            lg:px-6
            py-4
            lg:py-6
            border-b
            border-gray-200
            shrink-0
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
              FixNear
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Professional Panel
            </p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="
              lg:hidden
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-lg
              text-gray-600
              hover:bg-gray-100
              transition
            "
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-xl"
            />
          </button>
        </div>

        <nav
          className="
            p-3
            sm:p-4
            flex
            flex-col
            gap-2
            overflow-y-auto
            min-w-0
            w-full
            flex-1
          "
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  px-3
                  sm:px-4
                  py-2.5
                  sm:py-3
                  rounded-lg
                  transition
                  whitespace-nowrap
                  w-full
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `
              }
            >
              <span className="w-6 text-center shrink-0">
                {link.icon}
              </span>

              <span className="text-sm sm:text-base flex-1">
                {link.name}
              </span>

              {link.name === "Notifications" &&
                unreadCount > 0 && (
                  <span
                    className="
                      min-w-5
                      sm:min-w-5.5
                      h-5
                      sm:h-5.5
                      px-1
                      sm:px-1.5
                      flex
                      items-center
                      justify-center
                      bg-red-500
                      text-white
                      text-[10px]
                      sm:text-xs
                      font-bold
                      rounded-full
                      shrink-0
                    "
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default ProfessionalSidebar;