import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      tourName,
      tourId,
      fullName,
      phone,
      guestSize,
      bookAt,
      totalAmount,
    } = req.body;

    console.log("BOOKING BODY:", req.body);

    if (!fullName || !phone || !guestSize || !bookAt) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, guest size and booking date are required",
      });
    }

    if (tourId) {
      const tour = await Tour.findById(tourId);

      if (tour && Number(guestSize) > Number(tour.maxGroupSize)) {
        return res.status(400).json({
          success: false,
          message: `Only ${tour.maxGroupSize} seats available for this tour`,
        });
      }
    }

    const newBooking = new Booking({
      userId: userId || "",
      userEmail: userEmail || "guest@example.com",
      tourName: tourName || "Unknown Tour",
      tourId: tourId || "",
      fullName,
      phone,
      guestSize: Number(guestSize),
      bookAt,
      totalAmount: Number(totalAmount) || 0,
      status: "confirmed",
      invoiceNo: `INV-${Date.now()}`,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: savedBooking,
    });
  } catch (error) {
    console.log("CREATE BOOKING ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await Booking.find({ userEmail: email }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};