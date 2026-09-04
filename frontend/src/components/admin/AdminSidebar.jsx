import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getHelpSocket } from "../../services/helpSocket";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpUnreadCount, setHelpUnreadCount] = useState(0);

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
    {
      name: "Help & Support",
      path: "/admin-help",
      icon: "💬",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("fixnearToken");

    if (!token) {
      setHelpUnreadCount(0);
      return;
    }

    const fetchHelpUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/help/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const conversations = response.data?.conversations || [];

        const totalUnread = conversations.reduce(
          (total, conversation) =>
            total + (conversation.unreadForAdmin || 0),
          0
        );

        setHelpUnreadCount(totalUnread);
      } catch (error) {
        setHelpUnreadCount(0);
      }
    };

    fetchHelpUnreadCount();

    const socket = getHelpSocket();

    if (!socket) {
      return;
    }

    socket.emit("join-admin-room");

    const handleNewHelpMessage = (data) => {
      if (
        data?.senderRole === "user" ||
        data?.senderRole === "professional"
      ) {
        setHelpUnreadCount((count) => count + 1);
      }
    };

    const handleHelpUnreadUpdated = () => {
      fetchHelpUnreadCount();
    };

    socket.on("new-help-message", handleNewHelpMessage);
    socket.on("help-message", handleNewHelpMessage);

    window.addEventListener(
      "help-unread-updated",
      handleHelpUnreadUpdated
    );

    return () => {
      socket.off("new-help-message", handleNewHelpMessage);
      socket.off("help-message", handleNewHelpMessage);

      window.removeEventListener(
        "help-unread-updated",
        handleHelpUnreadUpdated
      );
    };
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("fixnearToken");
    localStorage.removeItem("fixnearUser");

    closeSidebar();

    navigate("/login");
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
            top-[58px]
            sm:top-[68px]
            left-2
            sm:left-3
            z-[60]
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
          aria-label="Open admin sidebar"
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
            top-[58px]
            sm:top-[68px]
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
          lg:h-screen
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
          lg:sticky
          lg:top-0
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

            <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Admin Panel
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
              aria-label="Close admin sidebar"
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
            px-2
            sm:px-3
            lg:px-4
            py-2
            sm:py-3
            lg:py-4
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
              <span className="w-5 sm:w-6 text-center shrink-0 text-sm sm:text-base lg:text-lg">
                {item.icon}
              </span>

              <span className="text-[10px] sm:text-sm lg:text-base flex-1 truncate">
                {item.name}
              </span>

              {item.name === "Help & Support" &&
                helpUnreadCount > 0 && (
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
                    {helpUnreadCount > 99
                      ? "99+"
                      : helpUnreadCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

        <div
          className="
            px-2
            sm:px-3
            lg:px-4
            pb-2
            sm:pb-3
            lg:pb-4
            shrink-0
          "
        >
          <div className="border-t border-gray-200 pt-2 sm:pt-3 lg:pt-4">
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3">
              <div
                className="
                  w-8
                  h-8
                  sm:w-10
                  sm:h-10
                  bg-blue-100
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-sm
                  sm:text-lg
                  shrink-0
                "
              >
                👨‍💼
              </div>

              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-semibold text-gray-800 truncate">
                  Administrator
                </p>

                <p className="text-[9px] sm:text-xs text-gray-500">
                  Admin
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-2
                sm:gap-3
                px-2
                sm:px-3
                lg:px-4
                py-2
                sm:py-2.5
                lg:py-3
                mt-1
                sm:mt-2
                rounded-lg
                text-red-600
                hover:bg-red-50
                transition-all
                duration-200
                whitespace-nowrap
              "
            >
              <span className="w-5 sm:w-6 text-center shrink-0 text-sm sm:text-base">
                🚪
              </span>

              <span className="text-[10px] sm:text-sm lg:text-base">
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