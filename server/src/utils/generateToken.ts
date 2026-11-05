import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";


export const generateToken = (
  userId: string,
  role: string,
  expiresIn: NonNullable<SignOptions["expiresIn"]>
): string => {
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