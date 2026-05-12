import React from "react";
import { Container, Row, Col } from "reactstrap";

import Subtitle from "../Shared/Subtitle";
import Newsletter from "../Shared/Newsletter";
import Contact from "./Contact";

import "../styles/About.css";

const worldImg = "https://cdn-icons-png.flaticon.com/512/814/814513.png";

const aboutImg =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

const About = () => {
  return (
    <>
      <section className="about">
        <Container>
          <Row className="align-items-center">
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center gap-3">
                  <Subtitle subtitle="About Us" />
                  <img src={worldImg} alt="World" />
                </div>

                <h1>
                  Traveling Opens The Door To Creating{" "}
                  <span className="highlight">Memories</span>
                </h1>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus tempus massa vitae elit consectetur, ut convallis
                  massa ultricies. Duis hendrerit turpis quis tincidunt
                  lobortis. Nullam vel faucibus mauris.
                </p>
              </div>
            </Col>

            <Col lg="6">
              <div className="about__image d-flex justify-content-center">
                <img src={aboutImg} alt="About Travel" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Contact />
      <Newsletter />
    </>
  );
};

export default About;