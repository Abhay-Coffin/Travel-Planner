import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { BASE_URL } from "../utils/config";
import "../styles/AdminDashboard.css";
import BackButton from "../Components/common/BackButton";

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      user?.token ||
      user?.data?.token ||
      user?.accessToken ||
      user?.data?.accessToken ||
      localStorage.getItem("token")
    );
  } catch {
    return localStorage.getItem("token");
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = getToken();

      const res = await axios.get(`${BASE_URL}/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setBookings(res.data?.data || []);
    } catch (error) {
      console.log("FETCH ADMIN BOOKINGS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBooking = async (id, field, value) => {
    try {
      const token = getToken();

      await axios.put(
        `${BASE_URL}/booking/admin/update/${id}`,
        {
          [field]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Booking updated");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>Manage Bookings</h1>
          <p>View, update, and monitor customer bookings.</p>
        </div>

        <Table bordered responsive hover className="admin__booking-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Tour</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Total</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.invoiceNo}</td>
                  <td>{booking.tourName}</td>
                  <td>{booking.fullName}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.guestSize}</td>
                  <td>{new Date(booking.bookAt).toLocaleDateString()}</td>
                  <td>₹{booking.totalAmount}</td>

                  <td>
                    <select
                      className={`admin__status-select ${booking.status}`}
                      value={booking.status}
                      onChange={(e) =>
                        updateBooking(booking._id, "status", e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  <td>
                    <select
                      className={`admin__status-select ${booking.paymentStatus}`}
                      value={booking.paymentStatus}
                      onChange={(e) =>
                        updateBooking(
                          booking._id,
                          "paymentStatus",
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </section>
  );
};

export default AdminBookings;