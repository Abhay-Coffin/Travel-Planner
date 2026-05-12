import React from "react";
import ServiceCard from "./ServiceCard";
import { Col, Row } from "reactstrap";

const serviceData = [
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
    title: "Calculate Weather",
    desc: "Calculate weather based on location",
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
    title: "Tour Guide",
    desc: "Get a tour guide for your next adventure",
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828911.png",
    title: "Customization",
    desc: "Customize your trip as per your needs",
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
    title: "Tours",
    desc: "Discover amazing tours and destinations",
  },
];

const ServiceList = () => {
  return (
    <Row>
      {serviceData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </Row>
  );
};

export default ServiceList;