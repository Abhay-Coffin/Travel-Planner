import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

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

const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Database Connected");
  } catch (err) {
    console.log("MongoDB Database Connection Failed");
    console.log(err);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("API is running");
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
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/chatbot", chatbotRoute);
app.use("/api/v1/payment", paymentRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

const startServer = async () => {
  await connect();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();