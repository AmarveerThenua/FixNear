import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="
        w-full
        min-h-14
        sm:min-h-16
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        gap-2
        px-2.5
        sm:px-6
        py-2
        sm:py-0
      "
    >
      <div className="min-w-0 shrink-0">
        <h2 className="text-sm sm:text-lg font-semibold text-gray-800 whitespace-nowrap">
          User Dashboard
        </h2>
      </div>

      <div
        className="
          flex
          items-center
          justify-end
          gap-2
          sm:gap-4
          min-w-0
        "
      >
        <div className="text-right min-w-0">
          <p
            className="
              text-[10px]
              sm:text-sm
              font-semibold
              text-gray-800
              truncate
              max-w-24
              sm:max-w-55
            "
          >
            {user?.name || "User"}
          </p>

          <p
            className="
              hidden
              sm:block
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
            px-2.5
            sm:px-4
            py-1.5
            sm:py-2
            text-[10px]
            sm:text-sm
            text-red-600
            border
            border-red-200
            rounded-md
            sm:rounded-lg
            hover:bg-red-50
            transition
            whitespace-nowrap
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserHeader;