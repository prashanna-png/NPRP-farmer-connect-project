import express from "express";
import { createQuery, getMyQueries } from "../controllers/queryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createQuery);

router.get("/my-queries", protect, getMyQueries);

export default router;
