import mongoose, { Schema, Model } from "mongoose";
import type { IProfile } from "../types/profile.types.js";




const profileSchema = new Schema<IProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },

  careerGoals: {
    type: [
      {
        targetRole: {
          type: String,
          trim: true,
        },
        description: String,
        preferredLocations: [String],
        preferredIndustries: [String],
      },
    ],
    default: [],
  },
  education: {
    type: [
      {
        institution: {
          type: String,
          trim: true,
        },
        degree: {
          type: String,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          trim: true,
        },
        startYear: Number,
        endYear: Number,
        grade: String,
        description: String,
      }
    ],
    default: [],
  },
  experience: {
    type: [
      {
        company: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        description: String,
        startDate: Date,
        endDate: Date,
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        employmentType: String,
        location: String,
        skills: {
          type: [String],
          default: [],
        },
      }
    ],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  portfolioUrl: {
    type: String,
    trim: true,
  },
  profilePicture: String,
},
  {
    timestamps: true
  }
);

profileSchema.index({ skills: 1 }); // creates on the skills field so that queries are much faster
profileSchema.index({ interests: 1 });


export const Profile: Model<IProfile> = (mongoose.models.Profile as Model<IProfile>) || mongoose.model<IProfile>("Profile", profileSchema);