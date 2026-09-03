import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: "📊",
    },
    {
      name: "Users",
      path: "/admin-users",
      icon: "👥",
    },
    {
      name: "Professionals",
      path: "/admin-professionals",
      icon: "👷",
    },
    {
      name: "Bookings",
      path: "/admin-bookings",
      icon: "📅",
    },
    {
      name: "Reviews",
      path: "/admin-reviews",
      icon: "⭐",
    },
    {
      name: "Notifications",
      path: "/admin-notifications",
      icon: "🔔",
    },
  ];

  // =========================
  // Close Sidebar
  // =========================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("fixnearToken");
    localStorage.removeItem("fixnearUser");

    closeSidebar();

    navigate("/login");
  };

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
        aria-label="Open admin sidebar"
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
          lg:h-screen
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
          lg:sticky
          lg:top-0
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
              Admin Panel
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
            aria-label="Close admin sidebar"
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
            px-3
            sm:px-4
            py-3
            lg:py-4
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
                  transition-all
                  duration-200
                  whitespace-nowrap
                  w-full
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }
                `
              }
            >
              <span className="w-6 text-center shrink-0 text-base sm:text-lg">
                {item.icon}
              </span>

              <span className="text-sm sm:text-base flex-1">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* =========================
            Admin Profile + Logout
        ========================= */}

        <div
          className="
            px-3
            sm:px-4
            pb-3
            sm:pb-4
            shrink-0
          "
        >
          <div className="border-t border-gray-200 pt-3 sm:pt-4">
            {/* Admin Info */}

            <div className="flex items-center gap-3 px-3 py-3">
              <div
                className="
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  bg-blue-100
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-base
                  sm:text-lg
                  shrink-0
                "
              >
                👨‍💼
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Administrator
                </p>

                <p className="text-xs text-gray-500">
                  Admin
                </p>
              </div>
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                sm:px-4
                py-2.5
                sm:py-3
                mt-2
                rounded-lg
                text-red-600
                hover:bg-red-50
                transition-all
                duration-200
                whitespace-nowrap
              "
            >
              <span className="w-6 text-center shrink-0">
                🚪
              </span>

              <span className="text-sm sm:text-base">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;