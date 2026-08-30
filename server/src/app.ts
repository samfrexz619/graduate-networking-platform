import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";




const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.get("/api/v1/health", (_req, res) => {

  res.status(200).json({
    success: true,
    message: "Server is healthy"
  })
});

export default app;