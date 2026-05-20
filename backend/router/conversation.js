import express from "express";

import verifyToken from "../utils/verifyToken.js";

import {
  createConversation,
  getUserConversations,
  updateConversation,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// Create
router.post("/", verifyToken, createConversation);

// Get all user conversations
router.get("/", verifyToken, getUserConversations);

// Update
router.put("/:id", verifyToken, updateConversation);

// Delete
router.delete("/:id", verifyToken, deleteConversation);

export default router;