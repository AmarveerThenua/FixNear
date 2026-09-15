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

  const iconButtonClass =
    "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all";

  const desktopLinkClass =
    "group flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap";

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 py-2 sm:py-2.5 lg:py-3">
          <Link
            to="/"
            className="shrink-0 flex items-center hover:opacity-90 transition"
          >
            <img
              className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto"
              src={Logo}
              alt="FixNear"
            />
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <Link
              to="/"
              className="group flex items-center justify-center gap-1.5 px-2.5 lg:px-3.5 py-2 rounded-lg text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="text-xs lg:text-sm shrink-0 group-hover:scale-110 transition-transform"
              />
              <span>Home</span>
            </Link>

            <Link
              to="/services"
              className="group flex items-center justify-center gap-1.5 px-2.5 lg:px-3.5 py-2 rounded-lg text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              <FontAwesomeIcon
                icon={faWrench}
                className="text-xs lg:text-sm shrink-0 group-hover:rotate-12 transition-transform"
              />
              <span>Services</span>
            </Link>

            {user?.role === "user" && (
              <>
                <Link
                  to="/professionals"
                  className={`${iconButtonClass} md:w-auto md:px-3`}
                  title="Find Professionals"
                  aria-label="Find Professionals"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Find Professionals
                  </span>
                </Link>

                <Link
                  to="/become-professional"
                  className={`${iconButtonClass} md:w-auto md:px-3`}
                  title="Become a Professional"
                  aria-label="Become a Professional"
                >
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Become a Professional
                  </span>
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  to={notificationPath}
                  className={`${iconButtonClass} relative`}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-0.5 flex items-center justify-center bg-red-500 text-white text-[6px] sm:text-[7px] md:text-[8px] font-bold rounded-full border border-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}

                  <span className="hidden md:inline ml-1.5">
                    Notifications
                  </span>
                </Link>

                <Link
                  to={dashboardPath}
                  className={`${iconButtonClass} md:w-auto md:px-3 text-blue-600`}
                  title="Dashboard"
                  aria-label="Dashboard"
                >
                  <FontAwesomeIcon
                    icon={faGaugeHigh}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Dashboard
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${iconButtonClass} md:w-auto md:px-3 text-red-600 hover:text-red-700 hover:bg-red-50`}
                  title="Logout"
                  aria-label="Logout"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${iconButtonClass} md:w-auto md:px-3 text-blue-600`}
                  title="Login"
                  aria-label="Login"
                >
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Login
                  </span>
                </Link>

                <Link
                  to="/register"
                  className={`${iconButtonClass} md:w-auto md:px-3 text-blue-600`}
                  title="Register"
                  aria-label="Register"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="text-[11px] sm:text-xs md:text-sm"
                  />

                  <span className="hidden md:inline ml-1.5">
                    Register
                  </span>
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