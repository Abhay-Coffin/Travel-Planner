import express from "express";

import verifyToken, {
  verifyUser,
} from "../utils/verifyToken.js";

import {
  createComment,
  deleteComment,
  getCommentsByBlogId,
} from "../controllers/commentController.js";

const commentRoute = express.Router();

// Create comment
commentRoute.post("/:blogId", createComment);

// Get comments by blog ID
commentRoute.get("/blog/:blogId", getCommentsByBlogId);

// Delete comment
commentRoute.delete(
  "/:commentId",
  verifyToken,
  verifyUser,
  deleteComment
);

export default commentRoute;