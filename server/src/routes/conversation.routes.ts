import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createConversation, getConversations } from "../controllers/conversation.controller.js";

const router = Router();


router.get("/", protect, getConversations);
router.post("/:userId", protect, createConversation);

export default router;