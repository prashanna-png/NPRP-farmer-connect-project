import express from "express";

import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

import {
  protect,
  authorizeRoles,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNotices);

router.post("/", protect, authorizeRoles("admin"), createNotice);

router.patch("/:id", protect, authorizeRoles("admin"), updateNotice);

router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

router.get("/:id", optionalAuth, getNoticeById);

export default router;
