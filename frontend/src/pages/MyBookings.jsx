import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import axios from "axios";

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

  const fetchBookings = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/booking/user/${user.email}`, {
        withCredentials: true,
      });

      setBookings(res.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(
        `${BASE_URL}/booking/cancel/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const downloadInvoice = (booking) => {
    const invoice = `
TRAVEL WORLD - BOOKING INVOICE

Invoice No: ${booking.invoiceNo}
Booking Status: ${booking.status}

Tour Name: ${booking.tourName}
Customer Name: ${booking.fullName}
Email: ${booking.userEmail}
Phone: ${booking.phone}
Travel Date: ${new Date(booking.bookAt).toLocaleDateString()}
Guests: ${booking.guestSize}

Total Amount: ₹${booking.totalAmount}

Thank you for booking with Travel World.
`;

    const blob = new Blob([invoice], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${booking.invoiceNo || "invoice"}.txt`;
    link.click();

    URL.revokeObjectURL(url);
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
            <h4 className="text-center">Please login to view bookings.</h4>
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

                      <span className={`booking__status ${booking.status}`}>
                        {booking.status}
                      </span>
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
                        {new Date(booking.bookAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Guests:</strong> {booking.guestSize}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{booking.totalAmount}
                      </p>
                    </div>

                    <div className="booking__history-actions">
                      <Button color="dark" onClick={() => downloadInvoice(booking)}>
                        Download Invoice
                      </Button>

                      {booking.status !== "cancelled" && (
                        <Button
                          color="danger"
                          onClick={() => cancelBooking(booking._id)}
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
            <h4 className="text-center">No bookings found.</h4>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default MyBookings;