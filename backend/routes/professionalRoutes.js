import express from "express";

import {
  createProfessional,
  getProfessionals,
  getProfessionalById,
  getMyProfessionalProfile,
  updateMyProfessionalProfile,
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

router.post(
  "/",
  protect,
  createProfessional
);

router.get(
  "/",
  getProfessionals
);

router.get(
  "/me",
  protect,
  getMyProfessionalProfile
);

router.put(
  "/me",
  protect,
  updateMyProfessionalProfile
);

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllProfessionalsAdmin
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getProfessionalAdminById
);

router.put(
  "/admin/:id/verify",
  protect,
  adminOnly,
  verifyProfessional
);

router.put(
  "/admin/:id/unverify",
  protect,
  adminOnly,
  unverifyProfessional
);

router.put(
  "/admin/:id/availability",
  protect,
  adminOnly,
  toggleProfessionalAvailability
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteProfessional
);

router.get(
  "/:id",
  getProfessionalById
);

export default router;