import crypto from "crypto";
import Itinerary from "../models/Itinerary.js";

const createShareId = () => {
  return crypto.randomBytes(8).toString("hex");
};

export const createItinerary = async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      travelers,
      interests,
      itinerary,
      isPublic,
    } = req.body;

    if (
      !destination ||
      !days ||
      !budget ||
      !travelers ||
      !interests ||
      !itinerary
    ) {
      return res.status(400).json({
        success: false,
        message: "All itinerary fields are required",
      });
    }

    const newItinerary = await Itinerary.create({
      userId: req.user?.id || null,
      destination,
      days,
      budget,
      travelers,
      interests,
      itinerary,
      isPublic: Boolean(isPublic),
      shareId: isPublic ? createShareId() : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Itinerary saved successfully",
      data: newItinerary,
    });
  } catch (error) {
    console.error("CREATE ITINERARY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save itinerary",
      error: error.message,
    });
  }
};

export const getMyItineraries = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required to view saved itineraries",
      });
    }

    const itineraries = await Itinerary.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: itineraries,
    });
  } catch (error) {
    console.error("GET MY ITINERARIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch itineraries",
      error: error.message,
    });
  }
};

export const getPublicItinerary = async (req, res) => {
  try {
    const { shareId } = req.params;

    const itinerary = await Itinerary.findOne({
      shareId,
      isPublic: true,
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Shared itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error("GET PUBLIC ITINERARY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shared itinerary",
      error: error.message,
    });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    if (itinerary.userId?.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own itinerary",
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ITINERARY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete itinerary",
      error: error.message,
    });
  }
};

export const getAllItinerariesForAdmin = async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: itineraries,
    });
  } catch (error) {
    console.error("ADMIN GET ITINERARIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all itineraries",
      error: error.message,
    });
  }
};

export const deleteItineraryByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findByIdAndDelete(id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Itinerary deleted by admin",
    });
  } catch (error) {
    console.error("ADMIN DELETE ITINERARY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete itinerary",
      error: error.message,
    });
  }
};