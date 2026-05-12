import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    reviewText: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);