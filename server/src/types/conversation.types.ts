import type { Document, Types } from "mongoose";


export interface IConversation extends Document {
  participants: Types.ObjectId[];
  participantKey: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}