import jwt, { type SignOptions } from "jsonwebtoken";


export const generateToken = (userId: string, role: string): string => {

  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign(
    {
      id: userId,
      role
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn
    }
  )
}