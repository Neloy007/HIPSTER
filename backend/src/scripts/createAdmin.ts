import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";

import User, { UserRole } from "../models/User";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const createAdmin = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    console.log("\n=== HIPSTER Initial Admin Setup ===\n");

    const name = await askQuestion("Admin name: ");
    const email = await askQuestion("Admin email: ");
    const password = await askQuestion("Admin password: ");

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      throw new Error(
        "Admin password must be at least 6 characters long"
      );
    }

    await mongoose.connect(mongoUri);

    console.log("\n✅ MongoDB connected successfully");

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      if (existingUser.role === UserRole.ADMIN) {
        console.log("⚠️ An admin with this email already exists.");
      } else {
        console.log(
          "⚠️ A user with this email already exists and is not an admin."
        );
      }

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    console.log("\n✅ Initial admin account created successfully");
    console.log(`📧 Admin email: ${normalizedEmail}`);
    console.log("🔐 Password stored securely as a hash");
  } catch (error) {
    console.error("\n❌ Failed to create admin:", error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

createAdmin();