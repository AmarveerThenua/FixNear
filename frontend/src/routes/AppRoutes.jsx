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
import ProfessionalLayout from "../layouts/ProfessionalLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import ProfessionalRoute from "../components/common/ProfessionalRoute";
import AdminRoute from "../components/common/AdminRoute";

import MyBookings from "../pages/user/MyBookings";
import BookingDetails from "../pages/user/BookingDetails";
import Profile from "../pages/user/Profile";
import Reviews from "../pages/user/Reviews";
import Notifications from "../pages/user/Notifications";
import BookingSuccess from "../pages/user/BookingSuccess";

import BecomeProfessional from "../pages/professional/BecomeProfessional";
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import ProfessionalBookings from "../pages/professional/ProfessionalBookings";
import ProfessionalProfilePage from "../pages/professional/ProfessionalProfile";
import ProfessionalReviews from "../pages/professional/ProfessionalReviews";
import ProfessionalNotifications from "../pages/professional/ProfessionalNotifications";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageProfessionals from "../pages/admin/ManageProfessionals";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageReviews from "../pages/admin/ManageReviews";
import AdminNotifications from "../pages/admin/AdminNotifications";

import ErrorPage from "../pages/ErrorPage";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

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

      </Route>


      {/* ================= AUTH ROUTES ================= */}
      {/* Only logged-out users can access these */}

      <Route element={<PublicRoute />}>

        <Route element={<PublicLayout />}>

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

        </Route>

      </Route>


      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

        {/* ================= USER PANEL ================= */}

        <Route element={<UserLayout />}>

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* My Bookings */}

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          {/* Booking Details */}

          <Route
            path="/booking/:id"
            element={<BookingDetails />}
          />

          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Reviews */}

          <Route
            path="/reviews"
            element={<Reviews />}
          />

          {/* Notifications */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* Booking Success */}

          <Route
            path="/booking-success"
            element={<BookingSuccess />}
          />

        </Route>


        {/* ================= BECOME PROFESSIONAL ================= */}

        <Route
          path="/become-professional"
          element={<BecomeProfessional />}
        />


        {/* ================= PROFESSIONAL PANEL ================= */}

        <Route element={<ProfessionalRoute />}>

          <Route element={<ProfessionalLayout />}>

            {/* Professional Dashboard */}

            <Route
              path="/professional-dashboard"
              element={<ProfessionalDashboard />}
            />

            {/* Booking Requests */}

            <Route
              path="/professional-bookings"
              element={<ProfessionalBookings />}
            />

            {/* Professional Profile */}

            <Route
              path="/professional-profile"
              element={<ProfessionalProfilePage />}
            />

            {/* Professional Reviews */}

            <Route
              path="/professional-reviews"
              element={<ProfessionalReviews />}
            />

            {/* Professional Notifications */}

            <Route
              path="/professional-notifications"
              element={<ProfessionalNotifications />}
            />

          </Route>

        </Route>


        {/* ================= ADMIN PANEL ================= */}

        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>

            {/* Admin Dashboard */}

            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />

            {/* Manage Users */}

            <Route
              path="/admin-users"
              element={<ManageUsers />}
            />

            {/* Manage Professionals */}

            <Route
              path="/admin-professionals"
              element={<ManageProfessionals />}
            />

            {/* Manage Bookings */}

            <Route
              path="/admin-bookings"
              element={<ManageBookings />}
            />

            {/* Manage Reviews */}

            <Route
              path="/admin-reviews"
              element={<ManageReviews />}
            />

            {/* Admin Notifications */}

            <Route
              path="/admin-notifications"
              element={<AdminNotifications />}
            />

          </Route>

        </Route>

      </Route>


      {/* ================= 404 ERROR PAGE ================= */}

      <Route
        path="*"
        element={<ErrorPage />}
      />

    </Routes>
  );
};

export default AppRoutes;