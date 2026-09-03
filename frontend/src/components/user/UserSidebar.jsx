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

  const isProfessional = user?.role === "professional";

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
        console.error(
          "Failed to fetch notification count:",
          error
        );

        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const dashboardPath = isProfessional
    ? "/professional-dashboard"
    : "/dashboard";

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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            fixed
            top-13
            sm:top-17
            left-2
            sm:left-3
            z-60
            w-9
            h-9
            sm:w-10
            sm:h-10
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
            className="text-base sm:text-lg"
          />
        </button>
      )}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            lg:hidden
            fixed
            top-14.5
            sm:top-17
            bottom-0
            left-0
            right-0
            z-40
            bg-black/40
          "
        />
      )}

      <aside
        className={`
          fixed
          lg:static
          top-[58px]
          sm:top-[68px]
          lg:top-auto
          left-0
          z-50
          h-[calc(100vh-58px)]
          sm:h-[calc(100vh-68px)]
          lg:h-auto
          w-56
          sm:w-60
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
            px-3
            sm:px-5
            lg:px-6
            py-3
            sm:py-4
            lg:py-6
            border-b
            border-gray-200
            shrink-0
            flex
            items-center
            justify-between
          "
        >
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-600">
              FixNear
            </h1>

            <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
              {isProfessional
                ? "Professional Panel"
                : "User Panel"}
            </p>
          </div>

          {sidebarOpen && (
            <button 
              type="button"
              onClick={closeSidebar}
              className="
                lg:hidden
                w-8
                h-8
                sm:w-9
                sm:h-9
                flex
                items-center
                justify-center
                rounded-lg
                text-gray-600
                hover:bg-gray-100
                transition
                shrink-0
              "
              aria-label="Close sidebar"
            > 
              <FontAwesomeIcon
                icon={faXmark}
                className="text-lg sm:text-xl"
              />
            </button>
          )}
        </div>

        <nav
          className="
            p-2
            sm:p-3
            lg:p-4
            flex
            flex-col
            gap-1.5
            sm:gap-2
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
                  gap-2
                  sm:gap-3
                  px-2.5
                  sm:px-3
                  lg:px-4
                  py-2
                  sm:py-2.5
                  lg:py-3
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
              <span className="w-5 sm:w-6 text-center shrink-0 text-sm sm:text-base">
                {item.icon}
              </span>

              <span className="text-[10px] sm:text-sm lg:text-base flex-1 truncate">
                {item.name}
              </span>

              {item.name === "Notifications" &&
                unreadCount > 0 && (
                  <span
                    className="
                      min-w-4
                      sm:min-w-5
                      h-4
                      sm:h-5
                      px-1
                      flex
                      items-center
                      justify-center
                      bg-red-500
                      text-white
                      text-[8px]
                      sm:text-[10px]
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