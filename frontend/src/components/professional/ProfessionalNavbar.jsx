import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const ProfessionalNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("fixnearToken");

      if (!token || !user) {
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

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-2 sm:py-3 lg:py-4">
          <Link
            to="/professional-dashboard"
            className="shrink-0 min-w-0"
          >
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
              FixNear
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/professional-dashboard"
              className="text-sm xl:text-base text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/professional-bookings"
              className="text-sm xl:text-base text-gray-700 hover:text-blue-600 transition whitespace-nowrap"
            >
              Service Requests
            </Link>

            <Link
              to="/professional-reviews"
              className="text-sm xl:text-base text-gray-700 hover:text-blue-600 transition"
            >
              Reviews
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            {user && (
              <>
                <Link
                  to="/professional-notifications"
                  className="hidden lg:flex relative items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-full hover:bg-gray-100 transition"
                  title="Notifications"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-gray-700 text-base xl:text-xl"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 xl:min-w-5 xl:h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[8px] xl:text-[11px] font-bold rounded-full border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/professional-profile"
                  className="hidden lg:block px-3 xl:px-4 py-2 text-sm xl:text-base text-blue-600 hover:text-blue-700 transition max-w-[160px] truncate"
                  title={user.name}
                >
                  {user.name || "Profile"}
                </Link>

                <span
                  className="lg:hidden max-w-[120px] sm:max-w-[180px] truncate text-[10px] sm:text-sm font-medium text-gray-700"
                  title={user.name}
                >
                  {user.name || "Professional"}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2 sm:px-3 lg:px-4 xl:px-5 py-1.5 sm:py-2 border border-red-200 text-red-600 text-[9px] sm:text-xs lg:text-sm rounded-md sm:rounded-lg hover:bg-red-50 transition whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;