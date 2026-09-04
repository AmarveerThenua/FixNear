import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";

import Register from "../pages/auth/Register";
import ProfessionalRegister from "../pages/auth/ProfessionalRegister";
import Login from "../pages/auth/Login";

import Dashboard from "../pages/user/Dashboard";
import UserProfessionals from "../pages/user/Professionals";
import UserProfessionalProfile from "../pages/user/ProfessionalProfile";
import UserBookService from "../pages/user/BookService";
import MyBookings from "../pages/user/MyBookings";
import BookingDetails from "../pages/user/BookingDetails";
import Profile from "../pages/user/Profile";
import Reviews from "../pages/user/Reviews";
import Notifications from "../pages/user/Notifications";
import BookingSuccess from "../pages/user/BookingSuccess";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import ProfessionalLayout from "../layouts/ProfessionalLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import ProfessionalRoute from "../components/common/ProfessionalRoute";
import AdminRoute from "../components/common/AdminRoute";

import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import ProfessionalBookings from "../pages/professional/ProfessionalBookings";
import ProfessionalProfilePage from "../pages/professional/ProfessionalProfile";
import EditProfessionalProfile from "../pages/professional/EditProfessionalProfile";
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
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/register" element={<Register />} />
          <Route
            path="/professional-register"
            element={<ProfessionalRegister />}
          />
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/professionals" element={<UserProfessionals />} />
          <Route
            path="/professionals/:id"
            element={<UserProfessionalProfile />}
          />
          <Route path="/book/:id" element={<UserBookService />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Route>
      </Route>

      <Route element={<ProfessionalRoute />}>
        <Route element={<ProfessionalLayout />}>
          <Route
            path="/professional-dashboard"
            element={<ProfessionalDashboard />}
          />
          <Route
            path="/professional-bookings"
            element={<ProfessionalBookings />}
          />
          <Route
            path="/professional-profile"
            element={<ProfessionalProfilePage />}
          />
          <Route
            path="/professional-profile/edit"
            element={<EditProfessionalProfile />}
          />
          <Route
            path="/professional-reviews"
            element={<ProfessionalReviews />}
          />
          <Route
            path="/professional-notifications"
            element={<ProfessionalNotifications />}
          />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<ManageUsers />} />
          <Route
            path="/admin-professionals"
            element={<ManageProfessionals />}
          />
          <Route path="/admin-bookings" element={<ManageBookings />} />
          <Route path="/admin-reviews" element={<ManageReviews />} />
          <Route
            path="/admin-notifications"
            element={<AdminNotifications />}
          />
        </Route>
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;