import express from "express";

import {
  createQuery,
  getMyQueries,
  getExpertQueries,
  assignQuery,
  replyToQuery,
  updateQueryStatus,
} from "../controllers/queryController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("farmer"), createQuery);
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

export default router;
