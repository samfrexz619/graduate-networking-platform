import { type Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../types/auth.types.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { isValidObjectId } from "../utils/helper.js";


export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {

  try {
    // check to ensure token exists & only authenticated user can create profile
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorised"
      })
      return;
    };
    // check if user exists
    const existingProfile = await Profile.findOne({
      userId: req.userId
    });

    if (existingProfile) {
      res.status(409).json({
        success: false,
        message: "Profile already exists"
      });
      return;
    };

    // check if user exists
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found!"
      });
      return;
    }

    // create user profile
    const {
      headline,
      bio,
      skills,
      interests,
      careerGoals,
      education,
      experience,
      location,
      linkedinUrl,
      githubUrl,
      profilePicture,
      isPublic,
    } = req.body;

    const profile = await Profile.create({
      userId: req.userId,
      headline,
      bio,
      skills,
      interests,
      careerGoals,
      education,
      experience,
      location,
      linkedinUrl,
      githubUrl,
      profilePicture,
      isPublic,
    });

    // update user
    await User.findByIdAndUpdate(req.userId, {
      profileCompleted: true
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // userId is gotten from the authentication middleware not the client, that is why we use req.userId and not const { userId } = req.body;
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const profile = await Profile.findOne({
      userId: req.userId
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found"
      });
      return;
    };

    res.status(200).json({
      success: true,
      message: "",
      data: profile
    })

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorised"
      })
      return;
    };

    const {
      headline,
      bio,
      skills,
      interests,
      careerGoals,
      education,
      experience,
      location,
      linkedinUrl,
      githubUrl,
      profilePicture,
      isPublic,
    } = req.body;

    const updates = Object.fromEntries(
      Object.entries({
        headline,
        bio,
        skills,
        interests,
        careerGoals,
        education,
        experience,
        location,
        linkedinUrl,
        githubUrl,
        profilePicture,
        isPublic,
      }).filter(([_, value]) => value !== undefined)
    );

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "User profile not found"
      });
      return;
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getPublicProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
      return;
    }

    if (!isValidObjectId(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user id format"
      });
      return
    }

    const profile = await Profile.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    if (!profile.isPublic) {
      res.status(403).json({
        success: false,
        message: "This profile is private",
      });
      return;
    };

    res.status(200).json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
} 