import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="
        w-full
        min-h-16
        bg-white
        border-b
        border-gray-200
        flex
        flex-col
        sm:flex-row
        items-start
        sm:items-center
        justify-between
        gap-3
        px-4
        sm:px-6
        py-3
        sm:py-0
      "
    >


      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          User Dashboard
        </h2>
      </div>



      <div
        className="
          w-full
          sm:w-auto
          flex
          items-center
          justify-between
          sm:justify-end
          gap-3
          sm:gap-4
          min-w-0
        "
      >
        <div className="text-left sm:text-right min-w-0 flex-1 sm:flex-none">
          <p
            className="
              text-sm
              font-semibold
              text-gray-800
              truncate
              sm:max-w-55
            "
          >
            {user?.name || "User"}
          </p>

          <p
            className="
              text-xs
              text-gray-500
              truncate
              sm:max-w-55
            "
          >
            {user?.email || ""}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="
            shrink-0
            px-3
            sm:px-4
            py-2
            text-xs
            sm:text-sm
            text-red-600
            border
            border-red-200
            rounded-lg
            hover:bg-red-50
            transition
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserHeader;