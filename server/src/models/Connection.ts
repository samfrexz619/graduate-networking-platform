import mongoose, { Schema, Model } from "mongoose";
import { ConnectionStatusValues, type IConnection } from "../types/connection.types.js";



const connectionSchema = new Schema<IConnection>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ConnectionStatusValues,
      default: "pending"
    }
  },
  {
    timestamps: true

  }
);

connectionSchema.index({ senderId: 1 });
connectionSchema.index({ receiverId: 1 });
connectionSchema.index({
  senderId: 1,
  receiverId: 1
});

export const Connection: Model<IConnection> = (mongoose.models.Connection as Model<IConnection>) || mongoose.model<IConnection>("Connection", connectionSchema);