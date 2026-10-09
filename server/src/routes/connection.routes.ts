import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { acceptConnectionRequest, cancelConnectionRequest, getConnections, getPendingConnections, rejectConnectionRequest, sendConnectionRequest } from "../controllers/connection.controller.js";



const router = Router();

router.get("/", protect, getConnections);
router.get("/pending", protect, getPendingConnections);

router.post("/:userId", protect, sendConnectionRequest);

router.patch("/:connectionId/accept", protect, acceptConnectionRequest);
router.patch("/:connectionId/reject", protect, rejectConnectionRequest);
router.patch("/:connectionId/cancel", protect, cancelConnectionRequest);
export default router;