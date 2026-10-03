import { type Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../types/auth.types.js";
import { Profile } from './../models/Profile.js';
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";
import type { PopulatedUser } from "../types/connection.types.js";



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
};

export const getPendingConnections = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    const incomingRequests = await Connection.find({
      receiverId: req.userId,
      status: "pending"
    })
      .populate<{ senderId: PopulatedUser }>(
        "senderId",
        "firstName lastName"
      )
      .sort({ createdAt: -1 });

    const outgoingRequests = await Connection.find({
      senderId: req.userId,
      status: "pending"
    })
      .populate<{ receiverId: PopulatedUser }>(
        "receiverId",
        "firstName lastName"
      )
      .sort({ createdAt: -1 });

    // Collect the IDs of all users involved in pending requests
    const userIds = [
      ...incomingRequests.map((connection) => connection.senderId._id),
      ...outgoingRequests.map((connection) => connection.receiverId._id)
    ];

    // Fetch all profiles in one query
    const profiles = await Profile.find({
      userId: { $in: userIds }
    }).select("userId headline profilePicture");


    // Create a lookup map for fast profile access
    const profileMap = new Map(
      profiles.map((profile) => [
        profile.userId.toString(),
        profile]
      ));

    // Format incoming requests
    const incoming = incomingRequests.map((connection) => {
      const userId = connection.senderId._id.toString();
      const profile = profileMap.get(userId);

      return {
        connectionId: connection._id,
        user: {
          _id: connection.senderId._id,
          firstName: connection.senderId.firstName,
          lastName: connection.senderId.lastName,
          headline: profile?.headline ?? null,
          profilePicture: profile?.profilePicture ?? null
        },
        createdAt: connection.createdAt
      }
    });

    const outgoing = outgoingRequests.map((connection) => {
      const userId = connection.receiverId._id.toString();
      const profile = profileMap.get(userId);

      return {
        connectionId: connection._id,
        user: {
          _id: connection.receiverId._id,
          firstName: connection.receiverId.firstName,
          lastName: connection.receiverId.lastName,
          headline: profile?.headline ?? null,
          profilePicture: profile?.profilePicture ?? null
        },
        createdAt: connection.createdAt
      }
    })

    res.status(200).json({
      success: true,
      data: {
        incoming,
        outgoing
      }
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
};

export const acceptConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    // const { connectionId } = req.params;

    const connectionId = Array.isArray(req.params.connectionId)
      ? req.params.connectionId[0]
      : req.params.connectionId;

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    // validate the connectionId with - !mongoose.Types.ObjectId.isValid(connectionId)
    if (!connectionId || !mongoose.Types.ObjectId.isValid(connectionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid connection id"
      });
      return;
    };

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found!"
      });
      return;
    };

    if (connection.receiverId.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to accept this request"
      });
      return;
    };

    if (connection.status !== "pending") {
      res.status(409).json({
        success: false,
        message: "Only pending requests can be accepted"
      });
      return;
    };

    connection.status = "accepted";
    connection.acceptedAt = new Date();

    await connection.save();

    res.status(200).json({
      success: true,
      message: "Connection accepted successfully"
    })

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error!"
    })
  }
};

export const rejectConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {

    const connectionId = Array.isArray(req.params.connectionId)
      ? req.params.connectionId[0]
      : req.params.connectionId;

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    if (!connectionId || !mongoose.Types.ObjectId.isValid(connectionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid connection id"
      });
      return;
    };

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found"
      });
      return;
    };

    // Authorization check
    if (connection?.receiverId.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to reject this request"
      });
      return;
    }

    if (connection.status !== "pending") {
      res.status(409).json({
        success: false,
        message: "Only pending requests can be rejected"
      });
      return;
    };

    connection.status = "rejected";

    await connection.save();

    res.status(200).json({
      success: true,
      message: "Connection rejected successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const cancelConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    const connectionId = Array.isArray(req.params.connectionId)
      ? req.params.connectionId[0]
      : req.params.connectionId;

    // Check if the user is authenticated
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    if (!connectionId || !mongoose.Types.ObjectId.isValid(connectionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid connection id"
      });
      return;
    };

    // Find the connection
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found"
      });
      return;
    };

    // Only the sender can cancel their own request
    if (connection.senderId.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this request"
      });
      return;
    };

    // Only pending requests can be cancelled
    if (connection.status !== "pending") {
      res.status(409).json({
        success: false,
        message: "Only pending requests can be cancelled"
      });
      return;
    };

    // Preserve the connection record but mark it as removed
    connection.status = "removed";

    await connection.save();

    res.status(200).json({
      success: true,
      message: "Connection request cancelled successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
};

export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    const connections = await Connection.find({
      $or: [
        {
          senderId: req.userId,
          status: "accepted"
        },
        {
          receiverId: req.userId,
          status: "accepted"
        }
      ]
    }).populate<{ senderId: PopulatedUser }>("senderId", "firstName lastName")
      .populate<{ receiverId: PopulatedUser }>("receiverId", "firstName lastName")
      .sort({ acceptedAt: -1 });

    const connectedUsers = connections.map((connection) =>
      connection.senderId._id.toString() === req.userId
        ? connection.receiverId
        : connection.senderId
    );

    const userIds = connectedUsers.map(user => user._id);

    // Fetch all profiles in one query
    const profiles = await Profile.find({
      userId: { $in: userIds }
    }).select("userId headline profilePicture");

    // Create a lookup map for fast profile access
    const profileMap = new Map(
      profiles.map((profile) => [
        profile.userId.toString(),
        profile]
      ));

    const formattedConnections = connections.map((connection) => {
      const connectedUser = connection.senderId.toString() === req.userId
        ? connection.receiverId
        : connection.senderId;

      const userId = connectedUser._id.toString();
      const profile = profileMap.get(userId);

      return {
        connectionId: connection._id,
        user: {
          _id: connectedUser._id,
          firstName: connectedUser.firstName,
          lastName: connectedUser.lastName,
          headline: profile?.headline ?? null,
          profilePicture: profile?.profilePicture ?? null,
        },
        connectedAt: connection.acceptedAt
      }
    });

    res.status(200).json({
      success: true,
      data: formattedConnections
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}