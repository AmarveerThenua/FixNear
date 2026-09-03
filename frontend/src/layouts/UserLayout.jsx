import React from "react";
import { Outlet } from "react-router-dom";

import UserSidebar from "../components/user/UserSidebar";
import UserHeader from "../components/user/UserHeader";

const UserLayout = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row overflow-x-hidden">

      <UserSidebar />

      <div className="flex-1 min-w-0 w-full">

        <UserHeader />

        <main className="w-full min-w-0 p-3 sm:p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;