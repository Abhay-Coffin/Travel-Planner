import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoute from "./router/auth.js";
import tourRoute from "./router/tours.js";
import userRoute from "./router/users.js";
import reviewRoute from "./router/review.js";
import bookingRoute from "./router/bookings.js";
import searchRoute from "./router/search.js";
import contactRoute from "./router/contact.js";
import blogRoute from "./router/blog.js";
import commentRoute from "./router/comment.js";
import aiRoute from "./router/ai.js";
import chatbotRoute from "./router/chatbot.js";
import paymentRoute from "./router/payment.js";
import weatherRoute from "./router/weather.js";
import itineraryRoute from "./router/itinerary.js";
import currencyRoute from "./router/currency.js";
import locationRoute from "./router/location.js";
import locationSearchRoute from "./router/locationSearch.js";
import nearbyPlacesRoute from "./router/nearbyPlaces.js";
import adminRoute from "./router/admin.js";
import conversationRoute from "./router/conversation.js";


const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://travel-planner-puce-pi.vercel.app",
  "https://travel-planner-git-main-abhay-sharmas-projects-bc8eb13e.vercel.app",
  "https://travel-planner-6w0tqvvb9-abhay-sharmas-projects-bc8eb13e.vercel.app",
];

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait and try again.",
  },
});

app.use(generalLimiter);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked this origin: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Database Connected");
  } catch (err) {
    console.log("MongoDB Database Connection Failed");
    console.log(err);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Travel Planner API is running",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/comment", commentRoute);

app.use("/api/v1/ai", aiLimiter, aiRoute);
app.use("/api/v1/chatbot", aiLimiter, chatbotRoute);
app.use("/api/v1/itineraries", itineraryRoute);
app.use("/api/v1/currency", currencyRoute);
app.use("/api/v1/location", locationRoute);
app.use("/api/v1/location", locationSearchRoute);
app.use("/api/v1/location/nearby", nearbyPlacesRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/conversations", conversationRoute);


app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/weather", weatherRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connect();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();