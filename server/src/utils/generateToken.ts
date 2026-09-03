import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";


export const generateToken = (userId: string, role: string): string => {

  const expiresIn = (env.JWT_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign(
    {
      id: userId,
      role
    },
    env.JWT_SECRET as string,
    {
      expiresIn
    }
  )
}