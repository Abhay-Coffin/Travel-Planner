import React from "react";

import {
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

import { useNavigate } from "react-router-dom";

import "../styles/NotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <Container>
        <Row className="justify-content-center">
          <Col lg="7" md="8" sm="12">
            <div className="page-not-found__content">
              <h1 className="display-4">
                Oops!
              </h1>

              <p className="lead">
                We couldn&apos;t find the page
                you&apos;re looking for.
              </p>

              <Button
                color="primary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNotFound;