import Blog from "../models/Blog.js";

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create the blog",
      error: error.message,
    });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update the blog",
      error: error.message,
    });
  }
};

// Get Single Blog
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comments");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("GET SINGLE BLOG ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch the blog",
      error: error.message,
    });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("GET ALL BLOGS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// Get Featured Blogs
export const getFeaturedBlogs = async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({ featured: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: featuredBlogs.length,
      message:
        featuredBlogs.length > 0
          ? "Featured blogs retrieved successfully"
          : "No featured blogs found",
      data: featuredBlogs,
    });
  } catch (err) {
    console.error("GET FEATURED BLOGS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get featured blogs",
      error: err.message,
    });
  }
};