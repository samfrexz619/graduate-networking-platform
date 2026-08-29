import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";



export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.headers)
    const {
      firstName,
      lastName,
      email,
      password,
      role
    } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "All fields are required"
      });
      return;
    };

    const existingUser = await User.findOne({ email, });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
      return;
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      }
    })

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

