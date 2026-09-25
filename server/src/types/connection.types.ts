import type { Document, Types } from "mongoose";


export const ConnectionStatusValues = [
  "pending",
  "accepted",
  "rejected",
  "removed",
] as const;

export type ConnectionStatus = typeof ConnectionStatusValues[number];


export interface IConnection extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt: Date
}