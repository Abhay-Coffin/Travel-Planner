import React, { useState } from "react";

import {
  Container,
  Row,
  Col,
} from "reactstrap";

import "./FAQ.css";

const faqData = [
  {
    question: "What is the best time to visit this destination?",
    answer:
      "The best time to visit this destination is during October to March. The weather is pleasant, and you can enjoy outdoor activities comfortably.",
  },
  {
    question: "How do I book a tour package?",
    answer:
      "You can book a tour package directly from our website or contact our customer support team for assistance.",
  },
  {
    question: "Are there any special discounts for group bookings?",
    answer:
      "Yes, we offer special discounts for group bookings. Please contact support to get group booking offers.",
  },
  {
    question: "What kind of accommodations do you provide?",
    answer:
      "We provide luxury hotels, budget guesthouses, and homestays based on your preference and budget.",
  },
  {
    question: "Do you offer travel insurance?",
    answer:
      "Yes, we offer travel insurance for medical emergencies, trip cancellations, lost baggage, and other travel risks.",
  },
];

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion((prev) => (prev === index ? null : index));
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h2 className="text-center">
              Frequently Asked Questions
            </h2>

            <div className="faq__wrapper">
              {faqData.map((item, index) => (
                <div
                  className={`faq__item ${
                    activeQuestion === index ? "active" : ""
                  }`}
                  key={index}
                >
                  <button
                    type="button"
                    className="faq__question"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h4>{item.question}</h4>

                    <span>
                      {activeQuestion === index ? (
                        <i className="ri-arrow-drop-up-line"></i>
                      ) : (
                        <i className="ri-arrow-drop-down-line"></i>
                      )}
                    </span>
                  </button>

                  {activeQuestion === index && (
                    <p>{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQ;