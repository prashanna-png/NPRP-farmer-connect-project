import express from "express";

import {
  createQuery,
  getMyQueries,
  getExpertQueries,
  assignQuery,
  replyToQuery,
  updateQueryStatus,
  getQueryById,
  addFarmerFollowUp,
} from "../controllers/queryController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  upload.single("image"),
  createQuery,
);

router.get("/my-queries", protect, authorizeRoles("farmer"), getMyQueries);

router.get(
  "/expert",
  protect,
  authorizeRoles("expert", "admin"),
  getExpertQueries,
);

router.patch("/:id/assign", protect, authorizeRoles("admin"), assignQuery);

router.post(
  "/:id/reply",
  protect,
  authorizeRoles("expert", "admin"),
  replyToQuery,
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("expert", "admin"),
  updateQueryStatus,
);

router.get("/:id", protect, getQueryById);

router.post(
  "/:id/follow-up",
  protect,
  authorizeRoles("farmer"),
  addFarmerFollowUp,
);

export default router;
