import { Router } from "express";
import { register, login, getCurrentUser, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { createProfile } from "../controllers/profile.controller.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);
router.post("/profile", createProfile);

export default router;