import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  STUDENT = "student",
  GRADUATE = "graduate",
  MENTOR = "mentor",
  RECRUITER = "recruiter",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  profileCompleted: boolean;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  }
)

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);