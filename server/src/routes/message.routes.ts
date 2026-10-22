import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMessages, readMessages, sendMessage } from "../controllers/message.controller.js";



const router = Router();

router.get("/:conversationId/messages", protect, getMessages);
router.patch("/:conversationId/messages/read", protect, readMessages);
router.post("/:conversationId/messages", protect, sendMessage);

// {{baseUrl}}/api/v1/messages/conversationid/messages?limit=3&before=NEXT_CURSOR
// PATCH /api/v1/conversations/:conversationId/messages/read
export default router;