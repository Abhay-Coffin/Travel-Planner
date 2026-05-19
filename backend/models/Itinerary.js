import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    days: {
      type: Number,
      required: true,
    },

    budget: {
      type: String,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
    },

    interests: {
      type: String,
      required: true,
    },

    itinerary: {
      type: String,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);