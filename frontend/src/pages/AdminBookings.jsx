import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../utils/config";
import "../styles/AdminDashboard.css";
import BackButton from "../Components/common/BackButton";

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/booking`, {
        withCredentials: true,
      });

      setBookings(res.data?.data || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>Manage Bookings</h1>
          <p>View all customer bookings.</p>
        </div>

        <Table bordered responsive hover>
          <thead>
            <tr>
              <th>Tour</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Guests</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.tourName}</td>
                  <td>{booking.fullName}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.guestSize}</td>
                  <td>{booking.bookAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
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