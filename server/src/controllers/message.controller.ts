import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import app from "../app.js";




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

    const messageData = {
      _id: message._id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      readAt: message.readAt ?? null,
      createdAt: message.createdAt,
    };

    const io = req.app.locals.io;

    io.to(conversationId).emit("new_message", messageData);

    res.status(201).json({
      success: true,
      data: messageData,
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

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    // validate the objectId
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
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

    const limitParam = Array.isArray(req.query.limit)
      ? req.query.limit[0]
      : req.query.limit;

    const beforeParam = Array.isArray(req.query.before)
      ? req.query.before[0]
      : req.query.before;
    // const { before } = req.query;

    const limit = Math.min(
      Math.max(Number(limitParam) || 30, 1),
      50
    );

    if (
      beforeParam &&
      (typeof beforeParam !== "string" ||
        !mongoose.Types.ObjectId.isValid(beforeParam)
      )) {
      res.status(400).json({
        success: false,
        message: "Invalid before cursor"
      });
      return;
    }

    let cursorMessage = null;

    if (beforeParam) {
      cursorMessage = await Message.findById(beforeParam);
      if (!cursorMessage) {
        res.status(400).json({
          success: false,
          message: "Invalid before cursor"
        });
        return;
      }

      if (cursorMessage.conversationId.toString() !== conversation._id.toString()) {
        res.status(400).json({
          success: false,
          message: "Invalid before cursor"
        });
        return;
      }
    }

    const query: {
      conversationId: mongoose.Types.ObjectId;
      createdAt?: {
        $lt: Date;
      };
    } = {
      conversationId: conversation._id
    }

    if (cursorMessage) {
      query.createdAt = {
        $lt: cursorMessage.createdAt
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = messages.length > limit;

    if (hasMore) {
      messages.pop();
    }

    messages.reverse();

    const nextCursor = hasMore
      ? messages[0]?._id
      : null;
    // const messages = await Message.find({
    //   conversationId: conversation._id
    // }).sort({
    //   createdAt: 1
    // });

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        limit,
        hasMore,
        nextCursor
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const readMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
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

    const readAt = new Date();

    const result = await Message.updateMany(
      {
        conversationId: conversation._id,
        senderId: { $ne: req.userId },
        readAt: { $exists: false }
      },
      {
        $set: {
          readAt
        }
      }
    );

    const io = app.locals.io;

    if (result.modifiedCount > 0) {
      io.to(conversationId).emit("message_read", {
        conversationId,
        userId: req.userId,
        readAt
      });
    }

    res.status(200).json({
      success: true,
      message: "messages marked as read",
      updatedCount: result.modifiedCount
    })


  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}