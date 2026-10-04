import mongoose, { Schema, Model } from "mongoose";
import type { INotification } from "../types/notification.types.js";


const notificationSchema = new Schema<INotification>({
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  actorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["connection_request", "connection_accepted"], //satisfies NotificationType[],
    required: true
  },
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: "Connection",
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

notificationSchema.index({
  recipientId: 1,
  read: 1,
  createdAt: -1
});

export const Notification: Model<INotification> = (mongoose.models.Notification as Model<INotification>) || mongoose.model<INotification>("Notification", notificationSchema);