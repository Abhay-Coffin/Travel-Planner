import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import BackButton from "../Components/Common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AuthPages.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: localStorage.getItem("resetEmail") || "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/auth/reset-password`, formData);

      toast.success(res.data.message || "Password reset successful!");

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <section className="auth__page">
      <Container>
        <BackButton />

        <Row className="justify-content-center">
          <Col lg="6">
            <div className="auth__card">
              <h2>Create New Password</h2>

              <p>Enter OTP and set your new password.</p>

              <form onSubmit={resetPassword}>
                <input
                  type="email"
                  name="email"
                  placeholder="Registered email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />

                <Button className="btn primary__btn w-100 mt-3">
                  Reset Password
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ResetPassword;