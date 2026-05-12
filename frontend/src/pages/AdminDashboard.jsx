import React from "react";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import BackButton from "../Components/Common/BackButton";

import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Tours",
      value: "24",
      icon: "ri-map-pin-line",
    },
    {
      title: "Total Users",
      value: "120",
      icon: "ri-user-line",
    },
    {
      title: "Bookings",
      value: "58",
      icon: "ri-calendar-check-line",
    },
    {
      title: "Revenue",
      value: "₹2.4L",
      icon: "ri-money-rupee-circle-line",
    },
  ];

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>Admin Dashboard</h1>
          <p>Manage tours, blogs, users, bookings and website activity.</p>
        </div>

        <Row>
          {stats.map((item, index) => (
            <Col lg="3" md="6" className="mb-4" key={index}>
              <motion.div
                className="admin__stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35 }}
                viewport={{ once: true }}
              >
                <div className="admin__icon">
                  <i className={item.icon}></i>
                </div>

                <h3>{item.value}</h3>
                <p>{item.title}</p>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col lg="4" md="6" className="mb-4">
            <div className="admin__action-card">
              <h4>Manage Tours</h4>
              <p>Add, edit, and delete tour packages.</p>
              <button onClick={() => navigate("/admin/tours")}>
                Open Tours
              </button>
            </div>
          </Col>

          <Col lg="4" md="6" className="mb-4">
            <div className="admin__action-card">
              <h4>Manage Blogs</h4>
              <p>Create and manage travel blogs and articles.</p>
              <button onClick={() => navigate("/admin/blogs")}>
                Open Blogs
              </button>
            </div>
          </Col>

          <Col lg="4" md="6" className="mb-4">
            <div className="admin__action-card">
              <h4>Manage Bookings</h4>
              <p>Track customer bookings and booking status.</p>
              <button onClick={() => navigate("/admin/bookings")}>
                Open Bookings
              </button>
            </div>
          </Col>

          <Col lg="4" md="6" className="mb-4">
            <div className="admin__action-card">
              <h4>Manage Users</h4>
              <p>View registered users and user activity.</p>
              <button onClick={() => navigate("/admin/users")}>
                Open Users
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminDashboard;