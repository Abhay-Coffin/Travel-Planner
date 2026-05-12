import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { username, rating, reviewText } = req.body;
    const { tourId } = req.params;

    if (!username || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Username, rating, and review text are required",
      });
    }

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const newReview = await Review.create({
      tour: tour._id,
      username,
      reviewText,
      rating: Number(rating),
    });

    tour.reviews.push(newReview._id);
    await tour.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get all reviews for a tour
export const getTourReviews = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const reviews = await Review.find({ tour: tourId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    console.error("GET TOUR REVIEWS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get tour reviews",
      error: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Tour.findByIdAndUpdate(review.tour, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};