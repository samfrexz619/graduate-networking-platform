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

socket.on("message_read", (data) => {
  console.log("message read:", data)
})

socket.on("join_conversation_error", (error) => {
  console.error("Join failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

/* Primary: #4F46E5
Background: #F8FAFC
Text: #0F172A

| Purpose | Colour |
|---|---|
| Primary | `#4F46E5` |
| Primary hover | `#4338CA` |
| Background | `#F8FAFC` |
| Surface/Card | `#FFFFFF` |
| Main text | `#0F172A` |
| Secondary text | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Error | `#DC2626` |
*/