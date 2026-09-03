import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">

      

      <AdminSidebar />

 

      <div className="flex-1 min-w-0">

     

        <header
          className="
            min-h-16
            bg-white
            border-b
            border-gray-200
            flex
            flex-col
            sm:flex-row
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
              Admin Panel
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Manage your FixNear platform
            </p>
          </div>


     

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            <div
              className="
                w-8
                h-8
                sm:w-9
                sm:h-9
                bg-blue-100
                rounded-full
                flex
                items-center
                justify-center
                text-sm
                sm:text-base
              "
            >
              👨‍💼
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Admin
              </p>
            </div>

          </div>

        </header>


      

        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;