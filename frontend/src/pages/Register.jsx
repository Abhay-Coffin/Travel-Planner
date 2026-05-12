import React, { useState, useContext } from "react";

import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/Login.css";

import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

import RegisterHyperBackground from "../Components/AnimatedBackground/RegisterHyperBackground";

const registerImg = "https://cdn-icons-png.flaticon.com/512/3456/3456388.png";
const userIcon = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;

    setIsEmailValid(value === "" || validateEmail(value));
    handleChange(e);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      toast.success("Registration successful!");

      dispatch({
        type: "REGISTER_SUCCESS",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error("An error occurred while registering. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section className="register__hyper-section">
      <RegisterHyperBackground />

      <Container>
        <Row>
          <Col lg="10" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="Register" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="User" />
                </div>

                <h2>Register</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="username"
                      value={credentials.username}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      id="fullName"
                      value={credentials.fullName}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      autoComplete="email"
                      id="email"
                      value={credentials.email}
                      onChange={handleEmailChange}
                    />

                    {!isEmailValid && (
                      <div className="alert alert-danger mt-2">
                        Please enter a valid email address
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <div className="password__input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                      />

                      <i
                        className={
                          showPassword ? "ri-eye-off-line" : "ri-eye-line"
                        }
                        onClick={togglePasswordVisibility}
                      ></i>
                    </div>
                  </FormGroup>

                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>

                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;