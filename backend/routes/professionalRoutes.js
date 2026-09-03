import express from "express";

import {
  createProfessional,
  getProfessionals,
  getProfessionalById,
  getMyProfessionalProfile,

  // Admin functions
  getAllProfessionalsAdmin,
  getProfessionalAdminById,
  verifyProfessional,
  unverifyProfessional,
  toggleProfessionalAvailability,
  deleteProfessional,

} from "../controllers/professionalController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ====================
// Professional Routes
// ====================


// Create Professional
// Only logged-in users can create a professional profile

router.post(
  "/",
  protect,
  createProfessional
);


// Get All Professionals
// Public route

router.get(
  "/",
  getProfessionals
);


// Get Logged-in Professional Profile
// Used by ProfessionalRoute

router.get(
  "/me",
  protect,
  getMyProfessionalProfile
);


// ====================
// Admin Professional Routes
// ====================


// Get All Professionals
// Admin only

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllProfessionalsAdmin
);


// Get Single Professional
// Admin only

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getProfessionalAdminById
);


// Verify Professional
// Admin only

router.put(
  "/admin/:id/verify",
  protect,
  adminOnly,
  verifyProfessional
);


// Remove Professional Verification
// Admin only

router.put(
  "/admin/:id/unverify",
  protect,
  adminOnly,
  unverifyProfessional
);


// Toggle Professional Availability
// Admin only

router.put(
  "/admin/:id/availability",
  protect,
  adminOnly,
  toggleProfessionalAvailability
);


// Delete Professional
// Admin only

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteProfessional
);


// ====================
// Get Single Professional
// ====================
// Keep this route AFTER admin routes.
// Otherwise "/admin/..." could be treated as an ID.

router.get(
  "/:id",
  getProfessionalById
);


export default router;