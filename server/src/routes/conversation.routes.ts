import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createConversation } from "../controllers/conversation.controller.js";

const router = Router();

router.post("/:userId", protect, createConversation);

export default router;