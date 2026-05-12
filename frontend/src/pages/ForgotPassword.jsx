import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import BackButton from "../Components/Common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AuthPages.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email,
      });

      toast.success("OTP generated!");

      setOtpSent(true);
      localStorage.setItem("resetEmail", email);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate OTP");
    }
  };

  return (
    <section className="auth__page">
      <Container>
        <BackButton />

        <Row className="justify-content-center">
          <Col lg="6">
            <div className="auth__card">
              <h2>Reset Your Password</h2>

              <p>Enter your registered email to receive OTP.</p>

              <form onSubmit={sendOtp}>
                <input
                  type="email"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button className="btn primary__btn w-100 mt-3">
                  Generate OTP
                </Button>
              </form>

              {otpSent && (
                <Button
                  color="success"
                  className="w-100 mt-3"
                  onClick={() => navigate("/reset-password")}
                >
                  Continue to Reset Password
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ForgotPassword;