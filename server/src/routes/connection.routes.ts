import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { acceptConnectionRequest, getPendingConnections, sendConnectionRequest } from "../controllers/connection.controller.js";



const router = Router();

router.post("/:userId", protect, sendConnectionRequest);
router.get("/pending", protect, getPendingConnections);
router.patch("/:connectionId", protect, acceptConnectionRequest);
export default router;