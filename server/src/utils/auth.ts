import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export interface AuthTokenPayload {
  id: string;
  role: string;
}

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
}