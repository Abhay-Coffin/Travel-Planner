import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import Itinerary from "../models/Itinerary.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalItineraries = await Itinerary.countDocuments();

    const bookings = await Booking.find();

    const totalRevenue = bookings.reduce((acc, booking) => {
      return acc + (Number(booking.totalAmount) || 0);
    }, 0);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentItineraries = await Itinerary.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const bookingsByMonth = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          bookings: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const popularDestinations = await Itinerary.aggregate([
      {
        $group: {
          _id: "$destination",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTours,
        totalBookings,
        totalItineraries,
        totalRevenue,
        recentBookings,
        recentUsers,
        recentItineraries,
        bookingsByMonth,
        popularDestinations,
      },
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin stats",
      error: error.message,
    });
  }
};

export default {
  getAdminStats,
};