import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userEmail: {
      type: String,
      default: "",
    },

    tourName: {
      type: String,
      default: "",
    },

    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    guestSize: {
      type: Number,
      required: true,
      min: 1,
    },

    bookAt: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentId: {
      type: String,
      default: "",
    },

    orderId: {
      type: String,
      default: "",
    },

    invoiceNo: {
      type: String,
      default: "",
    },

    cancellationReason: {
      type: String,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);