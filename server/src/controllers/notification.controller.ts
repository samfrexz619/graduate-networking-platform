import { type Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Notification } from "../models/Notification.js";
import type { PopulatedUser } from "../types/connection.types.js";
import { Profile } from "../models/Profile.js";
import mongoose from "mongoose";



export const getNotifications = async (req: AuthRequest, res: Response) => {

  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const notifications = await Notification.find({
      recipientId: req.userId
    }).populate<{ actorId: PopulatedUser | null }>(
      "actorId", "firstName lastName"
    ).sort({ createdAt: -1 });

    const actorIds = [
      ...new Set(
        notifications
          .map(notification => notification.actorId)
          .filter((actor): actor is PopulatedUser => !!actor)
          .map(actor => actor._id)
      )
    ];

    const profiles = await Profile.find({
      userId: { $in: actorIds }
    }).select("userId headline profilePicture");

    const profileMap = new Map(
      profiles.map(profile => [
        profile.userId.toString(),
        profile
      ])
    );

    const formattedNotifications = notifications.map(notification => {
      const actor = notification.actorId;

      // if (!actor) {
      //   return {
      //     _id: notification._id,
      //     type: notification.type,
      //     actor: null,
      //     connectionId: notification.connectionId,
      //     read: notification.read,
      //     createdAt: notification.createdAt,
      //   };
      // }

      const actorId = actor?._id;
      const profile = actorId ? profileMap.get(actorId.toString()) : undefined;

      return {
        _id: notification._id,
        type: notification.type,
        actor: actor
          ? {
            _id: actor._id,
            firstName: actor.firstName,
            lastName: actor.lastName,
            headline: profile?.headline ?? null,
            profilePicture: profile?.profilePicture ?? null
          }
          : null,
        connectionId: notification.connectionId,
        read: notification.read,
        createdAt: notification.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedNotifications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    // check if aunthenticated
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    // get notification id from params
    const notificationId = Array.isArray(req.params.notificationId)
      ? req.params.notificationId[0]
      : req.params.notificationId;

    // validate notification id
    if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid notification ID"
      });
      return;
    };

    // find notification belonging to current user
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientId: req.userId
    });

    // notification not found
    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found"
      });
      return;
    };

    // mark notification as read
    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    // check if aunthenticated
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    };

    //  Update all unread notifications belonging to user
    const result = await Notification.updateMany(
      {
        recipientId: req.userId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    // return how many notifications were updated
    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
      updatedCount: result.modifiedCount
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};