import jwt from "jsonwebtoken";
import User from "../models/User.js";

const errorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return errorHandler(res, 401, "No token provided");
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!process.env.JWT_SECRET) {
      return errorHandler(res, 500, "JWT_SECRET missing on server");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorHandler(res, 401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("VERIFY TOKEN ERROR:", error.message);
    return errorHandler(res, 401, "Invalid token");
  }
};

export const verifyUser = (req, res, next) => {
  if (req.user && (req.user.role === "user" || req.user.role === "admin")) {
    next();
  } else {
    return errorHandler(res, 403, "Access denied");
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return errorHandler(res, 403, "Admin access required");
  }
};

export default verifyToken;