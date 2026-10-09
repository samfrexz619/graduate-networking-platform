import { type Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Notification } from "../models/Notification.js";
import type { PopulatedUser } from "../types/connection.types.js";
import { Profile } from "../models/Profile.js";



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