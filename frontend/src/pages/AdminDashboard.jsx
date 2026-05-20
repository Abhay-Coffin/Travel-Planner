import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import BackButton from "../Components/common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AdminDashboard.css";

const CHART_COLORS = ["#faa935", "#ff7e01", "#22c55e", "#3b82f6", "#a855f7"];

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

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const token = getToken();

      const res = await axios.get(`${BASE_URL}/admin/stats`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatsData(res.data?.data);
    } catch (error) {
      console.error("ADMIN STATS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const stats = [
    {
      title: "Total Tours",
      value: statsData?.totalTours || 0,
      icon: "ri-map-pin-line",
    },
    {
      title: "Total Users",
      value: statsData?.totalUsers || 0,
      icon: "ri-user-line",
    },
    {
      title: "Bookings",
      value: statsData?.totalBookings || 0,
      icon: "ri-calendar-check-line",
    },
    {
      title: "AI Itineraries",
      value: statsData?.totalItineraries || 0,
      icon: "ri-robot-2-line",
    },
    {
      title: "Revenue",
      value: `₹${Number(statsData?.totalRevenue || 0).toLocaleString()}`,
      icon: "ri-money-rupee-circle-line",
    },
  ];

  const bookingChartData =
    statsData?.bookingsByMonth?.map((item) => ({
      month: monthNames[item._id] || item._id,
      bookings: item.bookings,
      revenue: item.revenue,
    })) || [];

  const destinationChartData =
    statsData?.popularDestinations?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>Admin Dashboard</h1>
          <p>Manage tours, users, bookings, itineraries and website activity.</p>
        </div>

        {loading ? (
          <div className="admin__loading">Loading admin analytics...</div>
        ) : (
          <>
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
              <Col lg="8" className="mb-4">
                <div className="admin__chart-box">
                  <h4>Bookings & Revenue by Month</h4>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" name="Bookings" fill="#faa935" />
                      <Bar dataKey="revenue" name="Revenue" fill="#ff7e01" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Col>

              <Col lg="4" className="mb-4">
                <div className="admin__chart-box">
                  <h4>Popular Destinations</h4>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={destinationChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label
                      >
                        {destinationChartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
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

              <Col lg="4" md="6" className="mb-4">
                <div className="admin__action-card">
                  <h4>AI Itineraries</h4>
                  <p>View public and saved AI-generated trip plans.</p>
                  <button onClick={() => navigate("/admin/itineraries")}>
                    Open Itineraries
                  </button>
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg="6" className="mb-4">
                <div className="admin__recent-box">
                  <h4>Recent Users</h4>

                  {statsData?.recentUsers?.length > 0 ? (
                    statsData.recentUsers.map((user) => (
                      <div className="admin__recent-item" key={user._id}>
                        <strong>{user.username || user.fullName}</strong>
                        <span>{user.email}</span>
                      </div>
                    ))
                  ) : (
                    <p>No recent users found.</p>
                  )}
                </div>
              </Col>

              <Col lg="6" className="mb-4">
                <div className="admin__recent-box">
                  <h4>Recent AI Itineraries</h4>

                  {statsData?.recentItineraries?.length > 0 ? (
                    statsData.recentItineraries.map((trip) => (
                      <div className="admin__recent-item" key={trip._id}>
                        <strong>{trip.destination}</strong>
                        <span>
                          {trip.days} days • {trip.budget}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No recent itineraries found.</p>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </section>
  );
};

export default AdminDashboard;