import Tour from "../models/Tour.js";

// Create new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();

    res.status(201).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to create tour",
    });
  }
};

// Update tour
export const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).populate("reviews");

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
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update tour",
    });
  }
};

// Delete tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedTour = await Tour.findByIdAndDelete(id);

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
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete tour",
    });
  }
};

// Get single tour
export const getSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id).populate({
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
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get the tour",
    });
  }
};

// Get all tours
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find().populate("reviews");

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tours",
    });
  }
};

// Get featured tours
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).populate("reviews");

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Featured tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get featured tours",
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
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tours count",
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