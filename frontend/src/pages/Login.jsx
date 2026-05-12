import React, { useContext, useRef, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import "../styles/Login.css";

import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

import BackButton from "../Components/common/BackButton";
import LoginVortexBackground from "../Components/AnimatedBackground/LoginVortexBackground";

const loginImg = "https://cdn-icons-png.flaticon.com/512/201/201623.png";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailRef.current.value.trim();
    const enteredPassword = passwordRef.current.value.trim();

    if (!enteredEmail || !enteredPassword) {
      return toast.error("Please fill all fields");
    }

    try {
      dispatch({ type: "LOGIN_START" });

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: result.message,
        });

        return toast.error(result.message || "Login failed");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: result.data,
      });

      localStorage.setItem("user", JSON.stringify(result.data));

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.message,
      });

      toast.error(err.message || "Something went wrong");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch({ type: "LOGIN_START" });

      const res = await fetch(`${BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: result.message,
        });

        return toast.error(result.message || "Google login failed");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: result.data,
      });

      localStorage.setItem("user", JSON.stringify(result.data));

      toast.success("Google login successful!");
      navigate("/");
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message,
      });

      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <section className="login__section login__vortex-section">
      <LoginVortexBackground />

      <Container>
        <BackButton />

        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="Travel Login" />
              </div>

              <div className="login__form">
                <div className="login__header">
                  <h2>Login</h2>
                  <p>Welcome back to Travel World</p>
                </div>

                <Form onSubmit={submitHandler}>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      ref={emailRef}
                    />
                  </FormGroup>

                  <FormGroup className="password__group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      ref={passwordRef}
                    />

                    <span
                      className="password__toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={
                          showPassword ? "ri-eye-off-line" : "ri-eye-line"
                        }
                      ></i>
                    </span>
                  </FormGroup>

                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                  >
                    Login
                  </Button>
                </Form>

                <div className="google__login-box">
                  <p>or login with</p>

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      toast.error("Google Login Failed");
                    }}
                  />
                </div>

                <p className="forgot__password text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>

                <p className="register__text">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">Create</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;