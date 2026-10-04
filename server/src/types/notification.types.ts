import type { Document, Types } from "mongoose";

export type NotificationType =
  | "connection_request"
  | "connection_accepted";

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  actorId: Types.ObjectId;
  type: NotificationType;
  connectionId: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}