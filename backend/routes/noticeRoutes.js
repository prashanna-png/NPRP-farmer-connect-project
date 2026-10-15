import express from "express";
import upload from "../middleware/uploadMiddleware.js";

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

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createNotice,
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateNotice,
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

router.get("/:id", optionalAuth, getNoticeById);

export default router;
