import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Conversation } from "../models/conversation.js";
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";




export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const targetUserId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
      return;
    }

    if (req.userId === targetUserId) {
      res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself"
      });
      return;
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    const connection = await Connection.findOne({
      $or: [
        {
          senderId: req.userId,
          receiverId: targetUserId,
          status: "accepted"
        },
        {
          senderId: targetUserId,
          receiverId: req.userId,
          status: "accepted"
        },
      ]
    });

    if (!connection) {
      res.status(403).json({
        success: false,
        message: "You can only message users you are connected with"
      });
      return;
    }

    const participantIds = [req.userId, targetUserId].sort();
    const participantKey = participantIds.join("_");

    const existingConversation = await Conversation.findOne({
      participantKey
    });

    if (existingConversation) {
      res.status(200).json({
        success: true,
        data: existingConversation
      });
      return;
    }

    const conversation = await Conversation.create({
      participants: participantIds,
      participantKey
    });

    res.status(201).json({
      success: true,
      data: conversation
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
};