import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHouse,
  faWrench,
  faUsers,
  faUserTie,
  faGaugeHigh,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/FixNearLogo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let isMounted = true;

    const fetchNotifications = async () => {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        if (isMounted) {
          setUnreadCount(0);
        }
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

        if (isMounted) {
          setUnreadCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        if (isMounted) {
          setUnreadCount(0);
        }
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    setUnreadCount(0);
    navigate("/login", { replace: true });
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
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4 py-2.5 sm:py-3 lg:py-4">
          <Link
            to="/"
            className="shrink-0 flex items-center hover:opacity-90 transition"
          >
            <img
              className="h-9 sm:h-10 lg:h-11 w-auto"
              src={Logo}
              alt="FixNear"
            />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            <Link
              to="/"
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="text-[11px] sm:text-xs lg:text-sm group-hover:scale-110 transition-transform"
              />
              <span>Home</span>
            </Link>

            <Link
              to="/services"
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              <FontAwesomeIcon
                icon={faWrench}
                className="text-[11px] sm:text-xs lg:text-sm group-hover:rotate-12 transition-transform"
              />
              <span>Services</span>
            </Link>

            {user?.role === "user" && (
              <>
                <Link
                  to="/professionals"
                  className="hidden lg:flex group items-center gap-2 px-3.5 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-sm group-hover:scale-110 transition-transform"
                  />
                  <span>Find Professionals</span>
                </Link>

                <Link
                  to="/become-professional"
                  className="hidden lg:flex group items-center gap-2 px-3.5 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="text-sm group-hover:scale-110 transition-transform"
                  />
                  <span>Become a Professional</span>
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  to={notificationPath}
                  className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 ml-1 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-sm sm:text-base lg:text-lg"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full border-2 border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={dashboardPath}
                  className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faGaugeHigh}
                    className="text-[11px] sm:text-xs lg:text-sm group-hover:scale-110 transition-transform"
                  />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs sm:text-sm lg:text-base font-medium hover:bg-red-50 hover:border-red-300 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="text-[11px] sm:text-xs lg:text-sm group-hover:translate-x-0.5 transition-transform"
                  />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-[11px] sm:text-xs lg:text-sm group-hover:translate-x-0.5 transition-transform"
                  />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="text-[11px] sm:text-xs lg:text-sm group-hover:scale-110 transition-transform"
                  />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;