import mongoose, { Model, Schema, Types } from "mongoose";
import type { IConversation } from "../types/conversation.types.js";


const conversationSchema = new Schema<IConversation>({
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    required: true,
    validate: {
      validator: (value: Types.ObjectId[]) => value.length === 2,
      message: "A conversation must have exactly two participants."
    }
  },
  participantKey: {
    type: String,
    required: true,
    unique: true,
  },
  lastMessage: {
    type: String,
    trim: true
  },
  lastMessageAt: {
    type: Date
  }
},
  {
    timestamps: true
  }
);

conversationSchema.index({ participants: 1 });

export const Conversation: Model<IConversation> = (mongoose.models.Conversation as Model<IConversation>) || mongoose.model<IConversation>("Conversation", conversationSchema);

