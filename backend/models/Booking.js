import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
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
      type: String,
      default: "",
    },

    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
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
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },

    invoiceNo: {
      type: String,
      default: "",
    },

    paymentId: {
  type: String,
  default: "",
},

orderId: {
  type: String,
  default: "",
},

paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending",
},

  },

  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);