import React from "react";
import "./Footer.css";

import { Container, Row, Col, ListGroupItem, ListGroup } from "reactstrap";
import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaDiscord,
  FaLinkedin,
  FaTelegramPlane,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const logo = "https://cdn-icons-png.flaticon.com/512/201/201623.png";

const quick__links = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
];

const quick__links2 = [
  { path: "/gallery", display: "Gallery" },
  { path: "/login", display: "Login" },
  { path: "/register", display: "Register" },
];

const socialLinks = [
  {
    icon: <FaInstagram />,
    url: "https://instagram.com/abhay_05_01",
    label: "Instagram",
  },
  {
    icon: <FaDiscord />,
    url: "https://discord.gg/qtQa2j6v",
    label: "Discord",
  },
  {
    icon: <FaLinkedin />,
    url: "https://linkedin.com/in/abhay-sharma-84998531b",
    label: "LinkedIn",
  },
  {
    icon: <FaTelegramPlane />,
    url: "https://t.me/Abhay000123",
    label: "Telegram",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="Travel World Logo" />
              <p>
                Explore beautiful destinations, book amazing tours, and create
                unforgettable travel memories.
              </p>
            </div>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Discover</h5>
            <ListGroup className="footer__quick-links">
              {quick__links.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Quick Links</h5>
            <ListGroup className="footer__quick-links">
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Contact</h5>

            <ListGroup className="footer__quick-links contact__links">
              <ListGroupItem className="ps-0 border-0">
                <a
                  href="mailto:sharmaabhay0501@gmail.com"
                  className="footer__contact-item"
                >
                  <FaEnvelope />
                  <span>sharmaabhay0501@gmail.com</span>
                </a>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0">
                <a href="tel:+917837242596" className="footer__contact-item">
                  <FaPhoneAlt />
                  <span>+91 7837242596</span>
                </a>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0">
                <div className="footer__contact-item">
                  <FaMapMarkerAlt />
                  <span>Bilaspur, Himachal Pradesh, India</span>
                </div>
              </ListGroupItem>
            </ListGroup>

            <div className="footer__socials">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </Col>

          <Col lg="12" className="text-center pt-5">
            <p className="copyright">
              &copy; {year} Travel World. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;