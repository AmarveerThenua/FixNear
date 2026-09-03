import React from "react";
import { Outlet } from "react-router-dom";

import ProfessionalNavbar from "../components/professional/ProfessionalNavbar";
import Footer from "../components/common/Footer";
import ProfessionalSidebar from "../components/professional/ProfessionalSidebar";

const ProfessionalLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      <ProfessionalNavbar />

      <div className="flex flex-1 flex-col lg:flex-row min-w-0">

        <ProfessionalSidebar />

        <main className="flex-1 min-w-0 bg-gray-50">
          <Outlet />
        </main>

      </div>

      <Footer />

    </div>
  );
};

export default ProfessionalLayout;