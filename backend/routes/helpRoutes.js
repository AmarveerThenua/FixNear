import express from "express";

import {
  getMyConversation,
  sendHelpMessage,
  getAllHelpConversations,
  getHelpConversationById,
  sendAdminHelpMessage,
  resolveHelpConversation,
} from "../controllers/helpController.js";

import {
  protect,
  adminOnly,
  userOrProfessionalOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/me",
  protect,
  userOrProfessionalOnly,
  getMyConversation
);

router.post(
  "/message",
  protect,
  userOrProfessionalOnly,
  sendHelpMessage
);

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllHelpConversations
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getHelpConversationById
);

router.post(
  "/admin/:id/message",
  protect,
  adminOnly,
  sendAdminHelpMessage
);

router.put(
  "/admin/:id/resolve",
  protect,
  adminOnly,
  resolveHelpConversation
);

export default router;