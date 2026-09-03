import express from "express";

import {
  getAdminDashboard,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ====================
// Admin Dashboard
// ====================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);

export default router;