import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";




export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const { content } = req.body;

    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    if (
      !conversationId ||
      !mongoose.Types.ObjectId.isValid(conversationId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID"
      });
      return;
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
      return;
    }

    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation"
      });
      return;
    }

    // validate message content
    if (typeof content !== "string") {
      res.status(400).json({
        success: false,
        message: "Message content must be a string"
      });
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      res.status(400).json({
        success: false,
        message: "Message content cannot be empty"
      });
      return;
    }

    const message = await Message.create({
      conversationId,
      senderId: req.userId,
      content: trimmedContent
    });

    conversation.lastMessage = message.content;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    res.status(201).json({
      success: true,
      data: message,
      message: "Message sent successfully"
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}