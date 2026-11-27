import type mongoose from "mongoose";


export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  description?: string;
}

export interface IExperience {
  company: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking?: boolean;
  description?: string;
  employmentType?: string;
  location?: string;
  skills?: string[];
}

export interface ICareerGoal {
  targetRole: string;
  description?: string;
  preferredLocations?: string[];
  preferredIndustries?: string[];
}

export interface IProfile {
  userId: mongoose.Types.ObjectId;

  headline?: string;
  bio?: string;

  careerGoals?: ICareerGoal[];
  skills?: string[];
  interests?: string[];

  experience?: IExperience[];
  education?: IEducation[];

  location?: string;

  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  isPublic?: boolean;
  profilePicture?: string;
}