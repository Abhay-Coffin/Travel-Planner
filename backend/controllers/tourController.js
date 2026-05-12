import Tour from "../models/Tour.js";

// Create new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();

    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: savedTour,
    });
  } catch (err) {
    console.error("CREATE TOUR ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to create tour",
      error: err.message,
    });
  }
};

// Update tour
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
    });

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (err) {
    console.error("UPDATE TOUR ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update tour",
      error: err.message,
    });
  }
};

// Delete tour
export const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);

    if (!deletedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (err) {
    console.error("DELETE TOUR ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete tour",
      error: err.message,
    });
  }
};

// Get single tour
export const getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (err) {
    console.error("GET SINGLE TOUR ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get the tour",
      error: err.message,
    });
  }
};

// Get all tours
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find()
      .populate({
        path: "reviews",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tours.length,
      message:
        tours.length > 0 ? "Tours retrieved successfully" : "No tours found",
      data: tours,
    });
  } catch (err) {
    console.error("GET ALL TOURS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tours",
      error: err.message,
    });
  }
};

// Get featured tours
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate({
        path: "reviews",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tours.length,
      message:
        tours.length > 0
          ? "Featured tours retrieved successfully"
          : "No featured tours found",
      data: tours,
    });
  } catch (err) {
    console.error("GET FEATURED TOURS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get featured tours",
      error: err.message,
    });
  }
};

// Get tour count
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();

    res.status(200).json({
      success: true,
      message: "Tours count retrieved successfully",
      data: tourCount,
    });
  } catch (err) {
    console.error("GET TOUR COUNT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tours count",
      error: err.message,
    });
  }
};

export default {
  createTour,
  deleteTour,
  updateTour,
  getSingleTour,
  getAllTour,
  getFeaturedTour,
  getTourCount,
};