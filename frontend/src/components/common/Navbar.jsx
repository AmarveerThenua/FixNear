import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
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

  const notificationPath =
    user?.role === "professional"
      ? "/professional-notifications"
      : user?.role === "admin"
      ? "/admin-notifications"
      : "/notifications";

  const dashboardPath =
    user?.role === "professional"
      ? "/professional-dashboard"
      : user?.role === "admin"
      ? "/admin-dashboard"
      : "/dashboard";

  return (
    <nav className="w-full bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-2 py-2.5 sm:py-3 lg:py-4">
          <Link to="/" className="shrink-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
              FixNear
            </h1>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
            {user ? (
              <>
                <Link
                  to={notificationPath}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full hover:bg-gray-100 transition"
                  title="Notifications"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-gray-700 text-sm sm:text-base lg:text-xl"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[8px] sm:text-[10px] lg:text-[11px] font-bold rounded-full border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={dashboardPath}
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 sm:px-3 lg:px-5 py-1.5 sm:py-2 border border-red-200 text-red-600 text-xs sm:text-sm lg:text-base rounded-lg hover:bg-red-50 transition whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base text-blue-600 hover:text-blue-700 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm lg:text-base rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-6 xl:gap-8 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link
              to="/"
              className="shrink-0 px-2 sm:px-3 lg:px-0 py-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/services"
              className="shrink-0 px-2 sm:px-3 lg:px-0 py-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-blue-600 transition"
            >
              Services
            </Link>

            {user?.role === "user" && (
              <Link
                to="/professionals"
                className="shrink-0 px-2 sm:px-3 lg:px-0 py-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-blue-600 transition"
              >
                Find Professionals
              </Link>
            )}

            {user?.role === "user" && (
              <Link
                to="/become-professional"
                className="shrink-0 px-2 sm:px-3 lg:px-0 py-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-blue-600 transition"
              >
                Become a Professional
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;