import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_missing",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "missing_secret",
});

export const createPaymentOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys missing in backend .env file",
      });
    }

    console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET EXISTS:", !!process.env.RAZORPAY_KEY_SECRET);

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

    if (!fullName || !phone || !guestSize || !bookAt || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "All payment fields are required",
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

    const options = {
      amount: Math.round(Number(totalAmount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        tourName: tourName || "",
        userEmail: userEmail || "",
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      bookingData: {
        userId: userId || "",
        userEmail: userEmail || "",
        tourName: tourName || "",
        tourId: tourId || "",
        fullName,
        phone,
        guestSize,
        bookAt,
        totalAmount,
      },
    });
  } catch (error) {
    console.log("PAYMENT ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

export const verifyPaymentAndCreateBooking = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key missing in backend .env file",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingData
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const newBooking = new Booking({
      ...bookingData,
      guestSize: Number(bookingData.guestSize),
      totalAmount: Number(bookingData.totalAmount),
      status: "confirmed",
      invoiceNo: `INV-${Date.now()}`,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "paid",
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Payment verified and booking confirmed",
      data: savedBooking,
    });
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};