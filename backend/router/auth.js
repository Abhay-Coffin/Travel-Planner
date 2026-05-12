import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";

const authRoute = express.Router();

// Register user
authRoute.post("/register", registerUser);

// Login user
authRoute.post("/login", loginUser);

// Forgot password
authRoute.post("/forgot-password", forgotPassword);

// Reset password
authRoute.post("/reset-password", resetPassword);

// Google login
authRoute.post("/google-login", googleLogin);

export default authRoute;