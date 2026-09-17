import { type Request, type Response } from "express";
import crypto from "crypto";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import type { AuthRequest } from "../types/auth.types.js";
import { sendEmail } from "../services/email.service.js";
import { env } from "../config/env.js";



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

    // 
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // creating new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      verificationToken,
      verificationTokenExpires
    });

    // verification link
    const verificationUrl = `${env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your Email Address",
      `
    <h2>Welcome to Graduate Networking Platform</h2>

    <p>Please verify your email address by clicking the link below:</p>

    <a href="${verificationUrl}">
      Verify Email
    </a>

    <p>This link expires in 24 hours.</p>
  `
    )

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
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

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { token } = req.params;

    const token = Array.isArray(req.params.token)
      ? req.params.token[0]
      : req.params.token;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
      return;
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {
        $gt: new Date(),
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
      return;
    };

    user.isVerified = true;

    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    })

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }

}

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

    // ensure user is email is verified before login in
    if (!user?.isVerified) {
      res.status(403).json({
        success: false,
        message: "Please verify your email address"
      });
      return;
    }

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      // token,
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
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {

  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required"
      });
      return;
    };

    const user = await User.findOne({ email });

    /**
     * Security:
     * Don't reveal whether email exists.
     */

    if (!user) {
      res.status(200).json({
        success: true,
        message: "If an account exists, a password reset email has been sent."
      });
      return;
    };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;

    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `
        <h2>Password Reset Request</h2>

        <p>Click the link below to reset your password:</p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>This link expires in 1 hour.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "If an account exists, a password reset email has been sent."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {

  try {

    const { password } = req.body;

    const token = Array.isArray(req.params.token)
      ? req.params.token[0]
      : req.params.token;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      })
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: "Password is required"
      });
      return;
    };

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: new Date()
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
      return;
    };

    user.password = password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    };

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
};

