import { type Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";


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
    })
  }
}