import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProfessionalBookings,
  updateBookingStatus,

  // Admin functions
  getAllBookingsAdmin,
  getBookingAdminById,
  updateBookingStatusAdmin,
  deleteBookingAdmin,

} from "../controllers/bookingController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ====================
// Customer Routes
// ====================

// Create booking

router.post(
  "/",
  protect,
  createBooking
);


// Get logged-in user's bookings

router.get(
  "/",
  protect,
  getMyBookings
);


// ====================
// Professional Routes
// ====================

// Get bookings received by logged-in professional

router.get(
  "/professional",
  protect,
  getProfessionalBookings
);


// Accept / Reject / Complete booking

router.put(
  "/:id/status",
  protect,
  updateBookingStatus
);


// ====================
// Admin Routes
// ====================

// Get all bookings

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBookingsAdmin
);


// Get single booking

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getBookingAdminById
);


// Update booking status

router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateBookingStatusAdmin
);


// Delete booking

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteBookingAdmin
);


// ====================
// Single Customer Booking
// ====================

router.get(
  "/:id",
  protect,
  getBookingById
);


// ====================
// Cancel Booking
// ====================

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);


export default router;