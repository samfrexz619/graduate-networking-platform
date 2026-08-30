import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";



export const register = async (req: Request, res: Response): Promise<void> => {

  try {
    // console.log(req.headers)
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

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
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
};

export const login = async (req: Request, res: Response): Promise<void> => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required!"
      });

      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

