"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function loginUserAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "Please fill in all credentials",
    };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const tokenPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieStore = await cookies();

    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1,
      path: "/",
    });

    return {
      success: true,
      message: "Login Successful",
      role: user.role,
    };
  } catch (error) {
    console.error("Login failed :: ", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}
