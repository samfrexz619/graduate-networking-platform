// import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import type { AuthenticatedSocket } from "./types/socket.types.js";
import { verifyToken } from "./utils/auth.js";
import { Conversation } from "./models/Conversation.js";




const PORT = env.PORT || 5001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", //assuming this is the frontend link
    credentials: true
  }
});

app.locals.io = io;

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("not authenticated"))
    }

    const tokenCookie = cookieHeader
      .split(";")
      .find(cookie => cookie.trim().startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("not authenticated"));
    }

    const token = tokenCookie.trim().slice("token=".length);
    const decoded = verifyToken(decodeURIComponent(token));
    const authenticatedSocket = socket as AuthenticatedSocket;

    authenticatedSocket.userId = decoded.id;

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
})

io.on("connection", (socket) => {

  const authenticatedSocket = socket as AuthenticatedSocket;

  console.log(
    "Socket connected:",
    authenticatedSocket.id,
    "User:",
    authenticatedSocket.userId
  );
  authenticatedSocket.on("join_conversation", async (conversationId: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        authenticatedSocket.emit("join_conversation_error", {
          message: "Invalid conversation ID"
        });
        return;
      }

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        authenticatedSocket.emit("join_conversation_error", {
          message: "Conversation not found"
        });
        return;
      }

      const isParticipant = conversation.participants.some(
        participant => participant.toString() === authenticatedSocket.userId
      );

      if (!isParticipant) {
        authenticatedSocket.emit("join_conversation_error", {
          message: "You are not a participant in this conversation"
        });
        return;
      }

      await authenticatedSocket.join(conversationId);
      await authenticatedSocket.emit("conversation_joined", {
        conversationId
      });

    } catch (error) {
      console.error(error);

      authenticatedSocket.emit("join_conversation_error", {
        message: "Internal server error"
      });
    }
  });


  authenticatedSocket.on("disconnect", () => {
    console.log("Socket disconnected", authenticatedSocket.id);
  });

});

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Application startup failed", err);
  process.exit(1);
});
