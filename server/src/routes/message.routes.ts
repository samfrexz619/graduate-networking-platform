import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";



const router = Router();

router.post("/:conversationId/messages", protect, sendMessage);

export default router;