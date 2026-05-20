import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

import CommonSection from "../Shared/CommonSection";
import Newsletter from "../Shared/Newsletter";
import BackButton from "../Components/common/BackButton";
import Loader from "../Components/Loader/Loader";

import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

import "../styles/MyBookings.css";

const MyBookings = () => {
  const { user } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchBookings = async () => {
    try {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/booking/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setBookings(res.data?.data || []);
    } catch (error) {
      console.log("FETCH BOOKINGS ERROR:", error);

      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const token = getToken();

      await axios.put(
        `${BASE_URL}/booking/cancel/${id}`,
        {
          reason: "Cancelled by user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Booking cancelled");

      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  const downloadInvoice = (booking) => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(255, 247, 232);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Travel World Invoice", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Booking confirmation and payment invoice", 15, 30);

    let y = 55;

    const addRow = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 15, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value || "N/A"), 70, y);

      y += 10;
    };

    addRow("Invoice No:", booking.invoiceNo);
    addRow("Tour Name:", booking.tourName);
    addRow("Customer:", booking.fullName);
    addRow("Email:", booking.userEmail);
    addRow("Phone:", booking.phone);
    addRow("Travel Date:", new Date(booking.bookAt).toLocaleDateString());
    addRow("Guests:", booking.guestSize);
    addRow("Booking Status:", booking.status);
    addRow("Payment Status:", booking.paymentStatus);
    addRow("Payment ID:", booking.paymentId || "N/A");
    addRow("Order ID:", booking.orderId || "N/A");

    y += 8;

    doc.setFillColor(250, 169, 53);
    doc.rect(15, y, pageWidth - 30, 18, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Total Amount: \u20B9${booking.totalAmount}`, 20, y + 12); // Used unicode for the Rupee symbol (₹) to avoid PDF encoding issues

    doc.setTextColor(0, 0, 0);

    y += 35;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Thank you for booking with Travel World.", 15, y);
    doc.text("This is a system-generated invoice.", 15, y + 8);

    doc.save(`${booking.invoiceNo || "booking-invoice"}.pdf`);

    toast.success("PDF invoice downloaded");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <CommonSection title="My Bookings" />

      <section className="my__bookings">
        <Container>
          <BackButton />

          {!user ? (
            <h4 className="text-center">
              Please login to view bookings.
            </h4>
          ) : bookings.length > 0 ? (
            <Row>
              {bookings.map((booking) => (
                <Col lg="6" className="mb-4" key={booking._id}>
                  <div className="booking__history-card">
                    <div className="booking__history-top">
                      <div>
                        <h4>{booking.tourName}</h4>

                        <p>{booking.invoiceNo}</p>
                      </div>

                      <div className="booking__status-wrapper">
                        <span
                          className={`booking__status ${booking.status}`}
                        >
                          {booking.status}
                        </span>

                        <span
                          className={`payment__status ${booking.paymentStatus}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="booking__history-info">
                      <p>
                        <strong>Name:</strong> {booking.fullName}
                      </p>

                      <p>
                        <strong>Email:</strong> {booking.userEmail}
                      </p>

                      <p>
                        <strong>Phone:</strong> {booking.phone}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          booking.bookAt
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Guests:</strong>{" "}
                        {booking.guestSize}
                      </p>

                      <p>
                        <strong>Total:</strong> ₹
                        {booking.totalAmount}
                      </p>
                    </div>

                    <div className="booking__history-actions">
                      <Button
                        color="dark"
                        onClick={() => downloadInvoice(booking)}
                      >
                        Download Invoice
                      </Button>

                      {booking.status !== "cancelled" && (
                        <Button
                          color="danger"
                          onClick={() =>
                            cancelBooking(booking._id)
                          }
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <h4 className="text-center">
              No bookings found.
            </h4>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default MyBookings;