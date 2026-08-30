import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";
import Professionals from "../pages/public/Professionals";
import ProfessionalProfile from "../pages/public/ProfessionalProfile";
import BookService from "../pages/public/BookService";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";

import Dashboard from "../pages/user/Dashboard";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";

import MyBookings from "../pages/user/MyBookings";
import BookingDetails from "../pages/user/BookingDetails";
import Profile from "../pages/user/Profile";
import SavedProfessionals from "../pages/user/SavedProfessionals";
import Reviews from "../pages/user/Reviews";
import Notifications from "../pages/user/Notifications";
import BookingSuccess from "../pages/user/BookingSuccess";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/services/:id"
          element={<ServiceDetails />}
        />

        <Route
          path="/professionals"
          element={<Professionals />}
        />

        <Route
          path="/professionals/:id"
          element={<ProfessionalProfile />}
        />

        <Route
          path="/book/:id"
          element={<BookService />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


      </Route>


      {/* ================= USER PANEL ================= */}

      <Route element={<ProtectedRoute />}>

        <Route element={<UserLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/booking/:id"
            element={<BookingDetails />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/saved-professionals"
            element={<SavedProfessionals />}
          />

          <Route
            path="/reviews"
            element={<Reviews />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Route>

        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />

      </Route>

    </Routes>
  );
};

export default AppRoutes;