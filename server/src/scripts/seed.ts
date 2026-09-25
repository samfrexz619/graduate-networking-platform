import "dotenv/config";
import mongoose from "mongoose";


import { User, UserRole } from "../models/User.js";
import { env } from "../config/env.js";

const seedUsers = async () => {

  try {
    await mongoose.connect(env.MONGODB_URI);
    const password = "Password123!";

    await User.create([
      {
        firstName: "barney",
        lastName: "Brown",
        email: "barney@test.com",
        password,
        isVerified: true,
        role: UserRole.STUDENT
      },
      {
        firstName: "bob",
        lastName: "Wilson",
        email: "bob@test.com",
        password,
        isVerified: true,
        role: UserRole.STUDENT
      },
    ]);
    console.log("Seeded users");
  } catch (error) {
    console.error(error)
  } finally {
    await mongoose.disconnect();
  }

};

seedUsers();