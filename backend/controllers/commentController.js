import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const createComment = async (req, res) => {
  const { username, comment } = req.body;
  const { blogId } = req.params;

  if (!username || !comment) {
    return res.status(400).json({
      success: false,
      message: "Username and comment are required fields",
    });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const newComment = new Comment({
      blog: blog._id,
      username,
      comment,
    });

    await newComment.save();

    blog.comments.push(newComment._id);
    await blog.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
};

// Get all comments for a specific blog
export const getCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comments = await Comment.find({ blog: blogId });

    res.status(200).json({
      success: true,
      count: comments.length,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get blog comments",
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const blog = await Blog.findById(comment.blog);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.comments.pull(commentId);
    await blog.save();

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};