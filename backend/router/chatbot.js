import express from "express";
import { chatWithAssistant } from "../controllers/chatbotController.js";

const chatbotRoute = express.Router();

chatbotRoute.post("/", chatWithAssistant);

export default chatbotRoute;