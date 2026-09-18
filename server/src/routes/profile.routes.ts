import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createProfile, getMyProfile } from "../controllers/profile.controller.js";




const router = Router();

router.post("/", protect, createProfile);
router.get("/me", protect, getMyProfile);

export default router;
