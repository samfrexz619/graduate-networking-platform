import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

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
  isVerified: boolean;
  verificationToken?: string | undefined;
  verificationTokenExpires?: Date | undefined;

  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date | undefined;
  comparePassword(
    candidatePassword: string
  ): Promise<boolean>
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
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
},
  {
    timestamps: true
  }
);

// Mongoose Pre-Save Hook: hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);
