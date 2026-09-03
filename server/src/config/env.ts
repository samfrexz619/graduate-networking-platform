import "dotenv/config";

export const env = {
  PORT: process.env.PORT!,
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  CLIENT_URL: process.env.CLIENT_URL!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
}