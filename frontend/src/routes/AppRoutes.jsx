import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";
import Professionals from "../pages/public/Professionals";
import PublicLayout from "../layouts/PublicLayout";

const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/services" element={<Services />} />

        <Route
          path="/services/:id"
          element={<ServiceDetails />}
        />

        <Route
          path="/professionals"
          element={<Professionals />}
        />
      </Route>

    </Routes>
  );
};

export default AppRoutes;