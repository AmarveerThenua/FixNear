import express from "express";

import {
  registerUser,
  registerProfessional,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/register-professional", registerProfessional);

router.post("/login", loginUser);

export default router;