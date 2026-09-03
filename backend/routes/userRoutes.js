import express from "express";

import {
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ====================
// User Routes
// ====================

// Update logged-in user's profile

router.put(
  "/profile",
  protect,
  updateProfile
);


// ====================
// Admin User Management
// ====================

// Get all users

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllUsers
);


// Get user by ID

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getUserById
);


// Change user role

router.put(
  "/admin/:id/role",
  protect,
  adminOnly,
  updateUserRole
);


// Delete user

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteUser
);


export default router;