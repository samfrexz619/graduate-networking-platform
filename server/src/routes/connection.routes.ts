import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { acceptConnectionRequest, cancelConnectionRequest, getConnections, getPendingConnections, rejectConnectionRequest, sendConnectionRequest } from "../controllers/connection.controller.js";



const router = Router();

router.post("/:userId", protect, sendConnectionRequest);
router.get("/pending", protect, getPendingConnections);
router.patch("/:connectionId/accept", protect, acceptConnectionRequest);
router.patch("/:connectionId/reject", protect, rejectConnectionRequest);
router.patch("/:connectionId/cancel", protect, cancelConnectionRequest);
router.get("/", protect, getConnections);
export default router;