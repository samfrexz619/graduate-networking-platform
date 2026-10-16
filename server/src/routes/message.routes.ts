import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";



const router = Router();

router.get("/:conversationId/messages", protect, getMessages);
router.post("/:conversationId/messages", protect, sendMessage);

// {{baseUrl}}/api/v1/messages/6ad04c050999cf/messages?limit=3&befor=NEXT_CURSOR
export default router;