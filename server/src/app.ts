import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";



const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.get("/api/v1/health", (_req, res) => {

  res.status(200).json({
    success: true,
    message: "Server is healthy"
  })
});

export default app;