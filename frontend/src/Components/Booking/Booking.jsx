import React, { useState, useContext } from "react";
import "./Booking.css";

import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext.jsx";
import { BASE_URL } from "../../utils/config";

const countryCodes = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+81", label: "🇯🇵 +81" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+41", label: "🇨🇭 +41" },
  { code: "+65", label: "🇸🇬 +65" },
];

const Booking = ({ tour, avgRating }) => {
  const {
    _id,
    price = 0,
    reviews = [],
    title = "",
    maxGroupSize = 1,
  } = tour || {};

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const serviceFee = 10;

  const [booking, setBooking] = useState({
    userId: user?._id || user?.id || "",
    userEmail: user?.email || "",
    tourName: title,
    tourId: _id,
    fullName: "",
    phoneCode: "+91",
    phone: "",
    guestSize: 1,
    bookAt: "",
  });

  const [paymentLoading, setPaymentLoading] = useState(false);

  const totalAmount =
    Number(price) * Number(booking.guestSize || 1) + serviceFee;

  const fullPhoneNumber = `${booking.phoneCode} ${booking.phone}`;

  const handleChange = (e) => {
    setBooking((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-script");

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (Number(booking.guestSize) > Number(maxGroupSize)) {
      toast.error(`Only ${maxGroupSize} seats available for this tour`);
      return;
    }

    if (!booking.fullName || !booking.phone || !booking.bookAt) {
      toast.error("Please fill all booking details");
      return;
    }

    setPaymentLoading(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      setPaymentLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(`${BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("token") || user?.token || ""
          }`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...booking,
          phone: fullPhoneNumber,
          userId: user?._id || user?.id,
          userEmail: user?.email,
          tourName: title,
          tourId: _id,
          totalAmount,
        }),
      });

      const orderResult = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderResult.message || "Failed to create payment order");
        return;
      }

      const options = {
        key: orderResult.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "Travel World",
        description: `Booking for ${title}`,
        order_id: orderResult.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BASE_URL}/payment/verify`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${
                  localStorage.getItem("token") || user?.token || ""
                }`,
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: orderResult.bookingData,
              }),
            });

            const verifyResult = await verifyRes.json();

            if (!verifyRes.ok) {
              toast.error(verifyResult.message || "Payment verification failed");
              return;
            }

            toast.success("Payment successful! Booking confirmed.");
            navigate("/my-bookings");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: booking.fullName,
          email: user?.email,
          contact: booking.phone,
        },

        notes: {
          tourName: title,
          guests: booking.guestSize,
          phone: fullPhoneNumber,
        },

        theme: {
          color: "#faa935",
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment popup closed");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.log("PAYMENT FAILED:", response);

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      paymentObject.open();
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ₹{price}
          <span>/per person</span>
        </h3>

        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
          {avgRating || "Not Rated"} ({reviews.length})
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>

        <Form className="booking__info-form" onSubmit={handlePayment}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              value={booking.fullName}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <div className="phone__group">
              <select
                id="phoneCode"
                value={booking.phoneCode}
                onChange={handleChange}
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                placeholder="Phone"
                id="phone"
                required
                value={booking.phone}
                onChange={handleChange}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              id="bookAt"
              required
              value={booking.bookAt}
              onChange={handleChange}
            />

            <input
              type="number"
              placeholder="Guest"
              id="guestSize"
              min="1"
              max={maxGroupSize}
              required
              value={booking.guestSize}
              onChange={handleChange}
            />
          </FormGroup>

          <p className="booking__seat-info">
            Available seat limit: {maxGroupSize} people
          </p>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ₹{price} <i className="ri-close-line"></i> {booking.guestSize}{" "}
              person
            </h5>

            <span>₹{price * booking.guestSize}</span>
          </ListGroupItem>

          <ListGroupItem className="border-0 px-0">
            <h5>Service Charge</h5>
            <span>₹{serviceFee}</span>
          </ListGroupItem>

          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>₹{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button
          className="btn primary__btn w-100 mt-4"
          onClick={handlePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <>
              <i className="ri-loader-4-line spinning"></i>
              Processing...
            </>
          ) : (
            "Pay & Book Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Booking;