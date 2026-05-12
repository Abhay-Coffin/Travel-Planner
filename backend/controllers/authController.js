import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

const sendTokenResponse = (res, user, message = "Login successful") => {
  const token = createToken(user);
  const { password, resetOtp, resetOtpExpire, ...userData } = user._doc;

  return res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message,
      token,
      data: userData,
    });
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google Client ID missing on server",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const safeUsername = `${name || "google_user"}_${sub.slice(0, 6)}`
        .replace(/\s+/g, "_")
        .toLowerCase();

      user = await User.create({
        username: safeUsername,
        fullName: name || "Google User",
        email,
        password: await bcrypt.hash(`google-${sub}`, 10),
        photo: picture || "",
        role: "user",
      });
    }

    return sendTokenResponse(res, user, "Google login successful");
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  const { username, fullName, email, password, photo } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingUsername = await User.findOne({
      username: username.trim(),
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      fullName: fullName?.trim() || username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      photo: photo || "",
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET missing on server",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return sendTokenResponse(res, user, "Login successful");
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email service is not configured",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Travel Planner",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color:#faa935;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};

export default {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
};