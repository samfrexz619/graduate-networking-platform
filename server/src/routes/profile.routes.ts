import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createProfile, getMyProfile, getPublicProfile, updateProfile } from "../controllers/profile.controller.js";




const router = Router();

router.post("/", protect, createProfile);
router.patch("/", protect, updateProfile);
router.get("/me", protect, getMyProfile);
router.get("/:userId", getPublicProfile);

export default router;
