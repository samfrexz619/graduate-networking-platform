import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { sendConnectionRequest } from "../controllers/connection.controller.js";



const router = Router();

router.post("/:userId", protect, sendConnectionRequest);

export default router;