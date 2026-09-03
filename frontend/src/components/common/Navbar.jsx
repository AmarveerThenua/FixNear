import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);



  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("fixnearToken");

      if (!token || !user) {
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

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);



  const closeMenu = () => {
    setMenuOpen(false);
  };


  const handleLogout = () => {
    closeMenu();
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

   

        <div className="flex items-center justify-between">


          <Link to="/" onClick={closeMenu}>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
              FixNear
            </h1>
          </Link>


    

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">

            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Services
            </Link>


            {user?.role === "user" && (
              <Link
                to="/professionals"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Find Professionals
              </Link>
            )}



            {user?.role === "user" && (
              <Link
                to="/become-professional"
                className="text-gray-700 hover:text-blue-600 transition whitespace-nowrap"
              >
                Become a Professional
              </Link>
            )}

          </div>


 

          <div className="hidden lg:flex items-center gap-3">

            {user ? (
              <>


                <Link
                  to={notificationPath}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
                  title="Notifications"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-gray-700 text-xl"
                  />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-1
                        -right-1
                        min-w-5
                        h-5
                        px-1
                        flex
                        items-center
                        justify-center
                        bg-red-500
                        text-white
                        text-[11px]
                        font-bold
                        rounded-full
                        border-2
                        border-white
                      "
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </Link>



                <Link
                  to={dashboardPath}
                  className="px-3 xl:px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                >
                  Dashboard
                </Link>



                <button
                  onClick={handleLogout}
                  className="
                    px-4
                    xl:px-5
                    py-2
                    border
                    border-red-200
                    text-red-600
                    rounded-lg
                    hover:bg-red-50
                    transition
                  "
                >
                  Logout
                </button>

              </>
            ) : (
              <>


                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                >
                  Login
                </Link>



                <Link
                  to="/register"
                  className="
                    px-5
                    py-2
                    bg-blue-600
                    text-white
                    rounded-lg
                    hover:bg-blue-700
                    transition
                  "
                >
                  Register
                </Link>

              </>
            )}

          </div>


        

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              lg:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-lg
              text-gray-700
              hover:bg-gray-100
              transition
            "
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className="text-xl"
            />
          </button>

        </div>



        {menuOpen && (
          <div
            className="
              lg:hidden
              mt-4
              pt-4
              border-t
              border-gray-200
              animate-[slideDown_0.2s_ease-out]
            "
          >

            <div className="flex flex-col gap-2">

            

              <Link
                to="/"
                onClick={closeMenu}
                className="
                  px-4
                  py-3
                  rounded-lg
                  text-gray-700
                  hover:bg-blue-50
                  hover:text-blue-600
                  transition
                "
              >
                Home
              </Link>


       

              <Link
                to="/services"
                onClick={closeMenu}
                className="
                  px-4
                  py-3
                  rounded-lg
                  text-gray-700
                  hover:bg-blue-50
                  hover:text-blue-600
                  transition
                "
              >
                Services
              </Link>



              {user?.role === "user" && (
                <Link
                  to="/professionals"
                  onClick={closeMenu}
                  className="
                    px-4
                    py-3
                    rounded-lg
                    text-gray-700
                    hover:bg-blue-50
                    hover:text-blue-600
                    transition
                  "
                >
                  Find Professionals
                </Link>
              )}


         

              {user?.role === "user" && (
                <Link
                  to="/become-professional"
                  onClick={closeMenu}
                  className="
                    px-4
                    py-3
                    rounded-lg
                    text-gray-700
                    hover:bg-blue-50
                    hover:text-blue-600
                    transition
                  "
                >
                  Become a Professional
                </Link>
              )}


              

              {user ? (
                <div className="mt-2 pt-3 border-t border-gray-200">

            

                  <Link
                    to={notificationPath}
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-lg
                      text-gray-700
                      hover:bg-blue-50
                      hover:text-blue-600
                      transition
                    "
                  >
                    <span>Notifications</span>

                    {unreadCount > 0 && (
                      <span className="min-w-6 h-6 px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </span>
                    )}
                  </Link>


     

                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="
                      block
                      px-4
                      py-3
                      rounded-lg
                      text-blue-600
                      hover:bg-blue-50
                      transition
                    "
                  >
                    Dashboard
                  </Link>


      

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      text-left
                      border
                      border-red-200
                      text-red-600
                      rounded-lg
                      hover:bg-red-50
                      transition
                    "
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <div className="mt-2 pt-3 border-t border-gray-200 flex flex-col gap-2">

     

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="
                      px-4
                      py-3
                      text-center
                      text-blue-600
                      border
                      border-blue-200
                      rounded-lg
                      hover:bg-blue-50
                      transition
                    "
                  >
                    Login
                  </Link>


                 

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="
                      px-4
                      py-3
                      text-center
                      bg-blue-600
                      text-white
                      rounded-lg
                      hover:bg-blue-700
                      transition
                    "
                  >
                    Register
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}

      </div>



      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </nav>
  );
};

export default Navbar;