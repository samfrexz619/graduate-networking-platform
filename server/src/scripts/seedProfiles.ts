import "dotenv/config";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import type { IProfile } from "../types/profile.types.js";


const profileSeeds: Array<{
  email: string;
  profile: Omit<IProfile, "userId">;
}> = [
    {
      email: "barney@test.com",
      profile: {
        headline: "Computer Science student",
        bio: "Interested in building useful software and learning from experienced engineers.",
        skills: ["TypeScript", "JavaScript", "React"],
        interests: ["Web development", "Open source"],
        careerGoals: ["Become a full-stack developer"],
        location: "London",
        isPublic: true,
      }
    },
    {
      email: "bob@test.com",
      profile: {
        headline: "Graduate software engineer",
        bio: "Early-career developer focused on backend systems.",
        skills: ["Node.js", "TypeScript", "MongoDB"],
        interests: ["Backend engineering", "Cloud computing"],
        careerGoals: ["Grow as a backend engineer"],
        location: "Manchester",
        isPublic: true,
      },
    },
    {
      email: "whyte@test.com",
      profile: {
        headline: "Aspiring software developer",
        bio: "Building practical projects while developing my programming skills.",
        skills: ["JavaScript", "HTML", "CSS"],
        interests: ["Frontend development", "UI design"],
        careerGoals: ["Find a junior developer role"],
        location: "Birmingham",
        isPublic: true,
      },
    },
  ];

async function seedProfiles(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);

    const normalizeEmail = (email: string) => email.trim().toLowerCase();
    const emails = profileSeeds.map(({ email }) => normalizeEmail(email));

    const users = await User.find({ email: { $in: emails } })
      .collation({ locale: "en", strength: 2 })
      .select("_id email");

    const usersByEmail = new Map(
      users.map((user) => [normalizeEmail(user.email), user]),
    );

    const missingEmails = emails.filter((email) => !usersByEmail.has(email));

    if (missingEmails.length > 0) {
      throw new Error(`User not found for emails: ${missingEmails.join(", ")}`);
    }

    for (const { email, profile } of profileSeeds) {
      // const user = usersByEmail.get(email);
      const user = usersByEmail.get(normalizeEmail(email));
      if (!user) {
        throw new Error(`User lookup failed for ${email}`);
      }

      await Profile.updateOne(
        { userId: user._id },
        { $set: { userId: user._id, ...profile } },
        { upsert: true }
      );

      await User.updateOne(
        { _id: user._id },
        { $set: { profileCompleted: true } }
      )
    }
    console.log(`Seeded ${profileSeeds.length} profiles successfully.`);
  } catch (error) {
    console.error("Error seeding profiles:", error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

void seedProfiles().catch((error) => {
  console.error("Error in seedProfiles:", error);
  process.exitCode = 1;
});