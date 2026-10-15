import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

export default router;
