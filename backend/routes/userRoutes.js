import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import { 
  getExperts, 
  updateUserProfile, 
  updateUserPassword 
} from "../controllers/userController.js";

const router = express.Router();

router.get("/experts", protect, authorizeRoles("admin"), getExperts);


router.put("/profile", protect, updateUserProfile);

router.put("/password", protect, updateUserPassword);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get(
  "/expert-test",
  protect,
  authorizeRoles("expert", "admin"),
  (req, res) => {
    res.status(200).json({
      message: "Expert access granted",
    });
  },
);

export default router;