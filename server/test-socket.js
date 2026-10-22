import { io } from "socket.io-client";

const token = ""
const conversationId = ""

if (!token || !conversationId) {
  console.log("TOKEN and CONVERSATION_ID are required");
  process.exit(1);
}

const socket = io("http://localhost:5001", {
  extraHeaders: {
    Cookie: `token=${token}`
  }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_conversation", conversationId);
});

socket.on("conversation_joined", (data) => {
  console.log("Joined conversation:", data);
});

socket.on("new_message", (message) => {
  console.log("new_message:", message)
});

socket.on("join_conversation_error", (error) => {
  console.error("Join failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});