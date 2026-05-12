import Blog from "../models/Blog.js";

// Create Blog
export const createBlog = async (req, res) => {
  try {
    console.log(req.body);

    const newBlog = await Blog.create(req.body);

    console.log(newBlog);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create the blog",
    });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the blog",
    });
  }
};

// Get Single Blog
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      res.status(200).json({
        success: true,
        data: blog,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the blog",
    });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

// Get Featured Blogs
export const getFeaturedBlogs = async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({
      featured: true,
    });

    if (featuredBlogs.length > 0) {
      res.status(200).json({
        success: true,
        message: "Featured blogs retrieved successfully",
        data: featuredBlogs,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No featured blogs found",
      });
    }
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get featured blogs",
    });
  }
};