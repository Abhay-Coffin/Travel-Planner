import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

const generateInvoiceNo = () => {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

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
      paymentId,
      orderId,
      paymentStatus,
    } = req.body;

    if (!fullName || !phone || !guestSize || !bookAt) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, guest size and booking date are required",
      });
    }

    if (Number(guestSize) < 1) {
      return res.status(400).json({
        success: false,
        message: "Guest size must be at least 1",
      });
    }

    let tour = null;

    if (tourId) {
      tour = await Tour.findById(tourId);

      if (tour && Number(guestSize) > Number(tour.maxGroupSize)) {
        return res.status(400).json({
          success: false,
          message: `Only ${tour.maxGroupSize} seats available for this tour`,
        });
      }
    }

    const newBooking = new Booking({
      userId: userId || req.user?._id || null,
      userEmail: userEmail || req.user?.email || "guest@example.com",
      tourName: tourName || tour?.title || "Unknown Tour",
      tourId: tourId || null,
      fullName,
      phone,
      guestSize: Number(guestSize),
      bookAt,
      totalAmount: Number(totalAmount) || 0,
      status: "confirmed",
      paymentStatus: paymentStatus || "pending",
      paymentId: paymentId || "",
      orderId: orderId || "",
      invoiceNo: generateInvoiceNo(),
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: savedBooking,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email")
      .populate("tourId", "title photo price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    const email = req.user?.email || req.params.email;

    const bookings = await Booking.find({
      $or: [{ userId }, { userEmail: email }],
    })
      .populate("tourId", "title photo price city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("GET USER BOOKINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";
    booking.paymentStatus =
      booking.paymentStatus === "paid" ? "refunded" : booking.paymentStatus;
    booking.cancellationReason = reason || "Cancelled by user";
    booking.cancelledAt = new Date();

    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

export const updateBookingStatusByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];
    const allowedPaymentStatus = ["pending", "paid", "failed", "refunded"];

    const updateData = {};

    if (status && allowedStatus.includes(status)) {
      updateData.status = status;
    }

    if (paymentStatus && allowedPaymentStatus.includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus;
    }

    const booking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("ADMIN UPDATE BOOKING ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "username email")
      .populate("tourId", "title photo price city");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("GET BOOKING BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};