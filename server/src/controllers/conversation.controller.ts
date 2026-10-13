import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Conversation } from "../models/Conversation.js";
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";
import type { PopulatedUser } from "../types/connection.types.js";
import { Profile } from "../models/Profile.js";




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

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const conversations = await Conversation.find({
      participants: req.userId
    })
      .populate<{ participants: PopulatedUser[] }>(
        "participants",
        "firstName lastName"
      )
      .sort({
        lastMessageAt: -1,
        createdAt: -1
      });

    const otherParticipants = conversations.map(conversation => conversation.participants.find(
      participant => participant._id.toString() !== req.userId
    ));

    const userIds = otherParticipants.filter((user): user is PopulatedUser => !!user)
      .map(user => user._id);

    const profiles = await Profile.find({
      userId: { $in: userIds }
    }).select("userId headline profilePicture");

    const profileMap = new Map(
      profiles.map(profile => [
        profile.userId.toString(),
        profile
      ])
    );

    const formattedConversations = conversations
      .map(conversation => {
        const otherUser = conversation.participants.find(
          participant => participant._id.toString() !== req.userId
        );

        if (!otherUser) {
          return null;
        }

        const profile = profileMap.get(
          otherUser._id.toString()
        );

        return {
          conversationId: conversation._id,
          user: {
            _id: otherUser._id,
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            headline: profile?.headline ?? null,
            profilePicture: profile?.profilePicture ?? null,
          },
          lastMessage: conversation.lastMessage ?? null,
          lastMessageAt: conversation.lastMessageAt ?? null,
          createdAt: conversation.createdAt
        }
      }).filter(Boolean);

    res.status(200).json({
      success: true,
      data: formattedConversations
    });
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}