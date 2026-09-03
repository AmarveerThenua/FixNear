import express from "express";

import {
  createReview,
  getProfessionalReviews,
  getMyReviews,
  getReviewableBookings,

  // Admin functions
  getAllReviewsAdmin,
  getReviewAdminById,
  deleteReviewAdmin,

} from "../controllers/reviewController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ====================
// Customer Routes
// ====================

// Create review

router.post(
  "/",
  protect,
  createReview
);


// Get my reviews

router.get(
  "/my",
  protect,
  getMyReviews
);


// Get reviewable bookings

router.get(
  "/reviewable",
  protect,
  getReviewableBookings
);


// Get reviews for professional

router.get(
  "/professional/:professionalId",
  getProfessionalReviews
);


// ====================
// Admin Routes
// ====================

// Get all reviews

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllReviewsAdmin
);


// Get single review

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getReviewAdminById
);


// Delete review

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteReviewAdmin
);


export default router;