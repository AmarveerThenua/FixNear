import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserHeader = () => {

  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Page Title */}
      <div>

        <h2 className="text-lg font-semibold text-gray-800">
          User Dashboard
        </h2>

      </div>

      {/* User */}
      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="text-sm font-semibold text-gray-800">
            {user?.name}
          </p>

          <p className="text-xs text-gray-500">
            {user?.email}
          </p>

        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default UserHeader;