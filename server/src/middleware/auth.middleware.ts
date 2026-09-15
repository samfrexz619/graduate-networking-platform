import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../types/auth.types.js";
import { env } from "../config/env.js";



export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {

  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
      return;
    };

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // req.user = {}

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  };
};