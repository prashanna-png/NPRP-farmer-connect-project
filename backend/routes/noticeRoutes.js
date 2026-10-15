import express from "express";

import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  protect,
  authorizeRoles,
  optionalAuth,
} from "../controllers/noticeController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNotices);

router.post("/", protect, authorizeRoles("admin"), createNotice);

router.patch("/:id", protect, authorizeRoles("admin"), updateNotice);

router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

router.get("/:id", protect, getNoticeById);

router.get("/:id", optionalAuth, getNoticeById);

export default router;
