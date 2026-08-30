import React from "react";
import { NavLink } from "react-router-dom";

const UserSidebar = () => {

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊"
    },
    {
      name: "Find Professionals",
      path: "/professionals",
      icon: "👷"
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
      icon: "📅"
    },
    {
      name: "Saved Professionals",
      path: "/saved-professionals",
      icon: "❤️"
    },
    {
      name: "Reviews",
      path: "/reviews",
      icon: "⭐"
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤"
    }
  ];
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">

        <h1 className="text-2xl font-bold text-blue-600">
          FixNear
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          User Panel
        </p>

      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
          >

            <span>
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>

    </aside>
  );
};

export default UserSidebar;