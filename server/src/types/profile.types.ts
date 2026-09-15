import type mongoose from "mongoose";


interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
};

interface IExperience {
  company: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking?: boolean;
  description?: string;
};

export interface IProfile {
  userId: mongoose.Types.ObjectId;
  headline?: string;
  bio?: string;
  careerGoals?: string[];
  skills?: string[];
  interests?: string[];
  experience?: IExperience[];
  education?: IEducation[];
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isPublic?: boolean;
  profilePicture?: string;
}