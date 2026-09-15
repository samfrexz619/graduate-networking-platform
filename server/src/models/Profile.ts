import mongoose, { Schema } from "mongoose";
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
    type: [String],
    default: [],
  },
  education: {
    type: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      }
    ],
    default: [],
  },
  experience: {
    type: [
      {
        company: String,
        title: String,
        description: String,
        startDate: Date,
        endDate: Date,
        currentlyWorking: Boolean,
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
  profilePicture: String,
},
  {
    timestamps: true
  }
);

profileSchema.index({ skills: 1 });
profileSchema.index({ interests: 1 });


export const Profile = mongoose.models.Profile || mongoose.model<IProfile>("Profile", profileSchema);