import React from "react";
import { Outlet } from "react-router-dom";

import UserSidebar from "../components/user/UserSidebar";
import UserHeader from "../components/user/UserHeader";

const UserLayout = () => {

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1">

        <UserHeader />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default UserLayout;