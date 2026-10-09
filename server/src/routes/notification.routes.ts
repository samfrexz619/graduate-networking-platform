import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notification.controller.js";


const router = Router();

// Put static/specific routes before parameterized routes.

router.get("/", protect, getNotifications);
router.patch("/read-all", protect, markAllNotificationsAsRead);
router.patch("/:notificationId/read", protect, markNotificationAsRead);

export default router;