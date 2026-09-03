import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const UserSidebar = () => {
  const { user } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Check User Role
  // =========================

  const isProfessional = user?.role === "professional";

  // =========================
  // Fetch Notification Count
  // =========================

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error(
          "Failed to fetch notification count:",
          error
        );

        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(
      fetchUnreadCount,
      10000
    );

    return () => clearInterval(interval);
  }, [user]);

  // =========================
  // Dashboard Path
  // =========================

  const dashboardPath = isProfessional
    ? "/professional-dashboard"
    : "/dashboard";

  // =========================
  // Navigation Items
  // =========================

  const navItems = [
    {
      name: "Dashboard",
      path: dashboardPath,
      icon: "📊",
    },
    {
      name: "Find Professionals",
      path: "/professionals",
      icon: "👷",
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
      icon: "📅",
    },
    {
      name: "Reviews",
      path: "/reviews",
      icon: "⭐",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  // =========================
  // Close Sidebar
  // =========================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================
  // Render
  // =========================

  return (
    <>
      {/* =========================
          Mobile Menu Button
      ========================= */}

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

      {/* =========================
          Mobile Overlay
      ========================= */}

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

      {/* =========================
          Sidebar
      ========================= */}

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
        {/* =========================
            Sidebar Header
        ========================= */}

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
              {isProfessional
                ? "Professional Panel"
                : "User Panel"}
            </p>
          </div>

          {/* Mobile Close Button */}

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

        {/* =========================
            Navigation
        ========================= */}

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
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
                  w-full
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }
                `
              }
            >
              {/* Icon */}

              <span className="w-6 text-center shrink-0">
                {item.icon}
              </span>

              {/* Name */}

              <span className="text-sm sm:text-base flex-1">
                {item.name}
              </span>

              {/* Notification Count */}

              {item.name === "Notifications" &&
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
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;