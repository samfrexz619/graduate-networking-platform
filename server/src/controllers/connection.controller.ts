import { type Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../types/auth.types.js";
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";



export const sendConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorised",
      });
      return;
    }

    // const { userId: targetUserId } = req.params;

    const targetUserId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    // validate userId
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
      return;
    };

    // prevent self connection
    if (req.userId === targetUserId) {
      res.status(400).json({
        success: false,
        message: "You cannot connect to yourself"
      });
      return;
    };

    // check if target user exists
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    };

    // check existing connection
    const existingConnection = await Connection.findOne({
      $or: [
        {
          senderId: req.userId,
          receiverId: targetUserId
        },
        {
          senderId: targetUserId,
          receiverId: req.userId
        },
      ]
    });

    if (existingConnection?.status === 'accepted') {
      res.status(409).json({
        success: false,
        message: "You are already connected"
      });
      return;
    }

    if (existingConnection?.status === 'pending' &&
      existingConnection?.senderId.toString() === req.userId) {
      res.status(409).json({
        success: false,
        message: "Connection request already sent"
      });
      return;
    }
    // if user send request and the other user sent request to this same user, then auto-accept
    if (existingConnection?.status === "pending" &&
      existingConnection?.senderId.toString() === targetUserId) {
      existingConnection.acceptedAt = new Date();
      existingConnection.status = 'accepted';

      await existingConnection.save();
      res.status(200).json({
        success: true,
        message: "Connection accepted"
      });
      return;
    }

    if (existingConnection?.status === 'rejected') {
      existingConnection.senderId = new mongoose.Types.ObjectId(req.userId);
      existingConnection.receiverId = new mongoose.Types.ObjectId(targetUserId);
      existingConnection.status = 'pending';

      // existingConnection.acceptedAt = undefined;

      await existingConnection.save();

      res.status(200).json({
        success: true,
        message: "Connection request sent"
      });
      return;
    }

    if (existingConnection?.status === 'removed') {
      existingConnection.senderId = new mongoose.Types.ObjectId(req.userId);
      existingConnection.receiverId = new mongoose.Types.ObjectId(targetUserId);

      existingConnection.status = 'pending';

      await existingConnection.save();

      res.status(200).json({
        success: true,
        message: "Connection request sent"
      });
      return;
    };

    const connection = await Connection.create({
      senderId: req.userId,
      receiverId: targetUserId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      data: connection
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}