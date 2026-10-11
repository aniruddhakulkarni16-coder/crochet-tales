import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

async function run() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("Add ADMIN_EMAIL and ADMIN_PASSWORD to .env first");
      return;
    }
    if (password.length < 10) {
      console.error("Password must be at least 10 characters");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { email: email.toLowerCase().trim(), passwordHash },
      { upsert: true, new: true }
    );

    console.log("Admin account saved for:", email);
  } catch (error) {
    console.error("Create admin failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();