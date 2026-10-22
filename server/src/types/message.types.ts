import type { Document, Types } from "mongoose";
import type { Server } from "socket.io";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  readAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppLocals {
  io: Server;
}