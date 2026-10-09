import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getNotifications } from "../controllers/notification.controller.js";


const router = Router();


router.get("/", protect, getNotifications);

export default router;