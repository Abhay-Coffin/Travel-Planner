import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

// Create a new review
export const createReview = async (req, res) => {
  const { username, rating, reviewText } = req.body;
  const { tourId } = req.params;

  if (!username || !rating || !reviewText) {
    return res.status(400).json({
      success: false,
      message: "Username, rating, and reviewText are required fields",
    });
  }

  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const newReview = new Review({
      tour: tour._id,
      username,
      reviewText,
      rating,
    });

    await newReview.save();

    tour.reviews.push(newReview._id);
    await tour.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// Get all reviews for a tour
export const getTourReviews = async (req, res) => {
  const { tourId } = req.params;

  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const reviews = await Review.find({ tour: tourId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tour reviews",
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const tour = await Tour.findById(review.tour);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    tour.reviews.pull(reviewId);
    await tour.save();

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};