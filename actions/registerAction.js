"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUserAction(formData) {
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const password = formData.get("password");

  if (!name || !email || !password) {
    return {
      success: false,
      message: "Please populate all registration fields.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  try {
    await connectDB();
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    return {
      success: true,
      message: "User registeration successful",
    };
  } catch (error) {
    console.error("REGISTRATION_ACTION_FAILURE:", error);
    return {
      success: false,
      error: "An internal server error occurred during sign-up.",
    };
  }
}
