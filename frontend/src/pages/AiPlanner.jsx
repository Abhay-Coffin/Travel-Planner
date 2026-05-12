import React, { useState } from "react";
import { Container, Row, Col, Button, Form, FormGroup } from "reactstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

import CommonSection from "../Shared/CommonSection";
import Newsletter from "../Shared/Newsletter";
import Loader from "../Components/Loader/Loader";
import BackButton from "../Components/common/BackButton";

import { BASE_URL } from "../utils/config";

import "../styles/AiPlanner.css";

const currencyOptions = [
  { code: "INR", label: "INR ₹" },
  { code: "USD", label: "USD $" },
  { code: "EUR", label: "EUR €" },
  { code: "GBP", label: "GBP £" },
  { code: "JPY", label: "JPY ¥" },
  { code: "AUD", label: "AUD A$" },
  { code: "CAD", label: "CAD C$" },
  { code: "CHF", label: "CHF CHF" },
];

const destinationCurrencyMap = {
  india: "INR",
  delhi: "INR",
  manali: "INR",
  goa: "INR",
  mumbai: "INR",
  paris: "EUR",
  france: "EUR",
  germany: "EUR",
  italy: "EUR",
  spain: "EUR",
  london: "GBP",
  england: "GBP",
  uk: "GBP",
  usa: "USD",
  america: "USD",
  newyork: "USD",
  "new york": "USD",
  japan: "JPY",
  tokyo: "JPY",
  australia: "AUD",
  canada: "CAD",
  switzerland: "CHF",
};

const getDestinationCurrency = (destination) => {
  const value = destination.toLowerCase();

  const matchedKey = Object.keys(destinationCurrencyMap).find((key) =>
    value.includes(key)
  );

  return matchedKey ? destinationCurrencyMap[matchedKey] : "USD";
};

const AiPlanner = () => {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    currency: "INR",
    travelers: "",
    interests: "",
  });

  const [itinerary, setItinerary] = useState("");
  const [convertedBudget, setConvertedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return {
        amount: Number(amount),
        from: fromCurrency,
        to: toCurrency,
        rate: 1,
      };
    }

    const response = await axios.get(
      `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`
    );

    const rate = response.data?.rates?.[toCurrency];

    if (!rate) {
      throw new Error("Currency conversion failed.");
    }

    return {
      amount: Number(amount) * rate,
      from: fromCurrency,
      to: toCurrency,
      rate,
    };
  };

  const generateItinerary = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setItinerary("");
    setConvertedBudget(null);

    try {
      const destinationCurrency = getDestinationCurrency(formData.destination);

      const conversion = await convertCurrency(
        formData.budget,
        formData.currency,
        destinationCurrency
      );

      setConvertedBudget(conversion);

      const payload = {
        ...formData,
        destinationCurrency,
        originalBudget: `${formData.budget} ${formData.currency}`,
        convertedBudget: `${conversion.amount.toFixed(2)} ${conversion.to}`,
        budget: `${conversion.amount.toFixed(2)} ${conversion.to}`,
      };

      const response = await axios.post(`${BASE_URL}/ai/itinerary`, payload);

      setItinerary(response.data?.data || "No itinerary generated.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate itinerary."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = () => {
    if (!itinerary) return;

    const savedTrips = JSON.parse(localStorage.getItem("savedItineraries")) || [];

    const newTrip = {
      destination: formData.destination,
      days: formData.days,
      budget: convertedBudget
        ? `${convertedBudget.amount.toFixed(2)} ${convertedBudget.to}`
        : `${formData.budget} ${formData.currency}`,
      travelers: formData.travelers,
      interests: formData.interests,
      itinerary,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "savedItineraries",
      JSON.stringify([newTrip, ...savedTrips])
    );

    toast.success("Itinerary saved!");
  };

  const copyItinerary = async () => {
    if (!itinerary) return;

    await navigator.clipboard.writeText(itinerary);
    toast.success("Copied to clipboard!");
  };

  const downloadItinerary = () => {
    if (!itinerary) return;

    const finalBudget = convertedBudget
      ? `${convertedBudget.amount.toFixed(2)} ${convertedBudget.to}`
      : `${formData.budget} ${formData.currency}`;

    const content = `AI Travel Itinerary

Destination: ${formData.destination}
Days: ${formData.days}
Travelers: ${formData.travelers}
Budget: ${finalBudget}
Interests: ${formData.interests}

${itinerary}`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${formData.destination || "travel"}-itinerary.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CommonSection title="AI Itinerary Generator" />

      <section className="ai__planner">
        <Container>
          <BackButton />

          <Row className="justify-content-center">
            <Col lg="8">
              <motion.div
                className="ai__planner-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2>Plan Your Trip With AI</h2>

                <p>
                  Enter your travel details and AI will generate a personalized
                  itinerary with budget conversion.
                </p>

                <Form onSubmit={generateItinerary}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Destination</label>

                        <input
                          type="text"
                          name="destination"
                          placeholder="Example: Paris"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>Number of Days</label>

                        <input
                          type="number"
                          name="days"
                          placeholder="Example: 4"
                          value={formData.days}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>Budget</label>

                        <div className="budget__wrapper">
                          <input
                            type="number"
                            name="budget"
                            placeholder="Enter budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                          />

                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                          >
                            {currencyOptions.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>Travelers</label>

                        <input
                          type="number"
                          name="travelers"
                          placeholder="Example: 2"
                          value={formData.travelers}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup>
                        <label>Interests</label>

                        <textarea
                          name="interests"
                          placeholder="Example: museums, nightlife, cafes, shopping"
                          value={formData.interests}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="btn primary__btn ai__btn"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate AI Itinerary"}
                  </Button>
                </Form>
              </motion.div>
            </Col>
          </Row>

          {loading && <Loader />}

          {error && (
            <Row className="justify-content-center mt-4">
              <Col lg="8">
                <div className="ai__error">{error}</div>
              </Col>
            </Row>
          )}

          {convertedBudget && (
            <Row className="justify-content-center mt-4">
              <Col lg="10">
                <div className="currency__summary">
                  <h5>Currency Conversion</h5>

                  <p>
                    Your budget{" "}
                    <strong>
                      {formData.budget} {formData.currency}
                    </strong>{" "}
                    is approximately{" "}
                    <strong>
                      {convertedBudget.amount.toFixed(2)} {convertedBudget.to}
                    </strong>{" "}
                    for {formData.destination}.
                  </p>

                  <small>
                    Exchange rate used: 1 {convertedBudget.from} ={" "}
                    {convertedBudget.rate.toFixed(4)} {convertedBudget.to}
                  </small>
                </div>
              </Col>
            </Row>
          )}

          {itinerary && (
            <Row className="justify-content-center mt-5">
              <Col lg="10">
                <motion.div
                  className="ai__result"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3>Your AI Generated Itinerary</h3>

                  <div className="ai__actions">
                    <Button color="success" onClick={saveItinerary}>
                      Save
                    </Button>

                    <Button color="info" onClick={copyItinerary}>
                      Copy
                    </Button>

                    <Button color="dark" onClick={downloadItinerary}>
                      Download
                    </Button>
                  </div>

                  <pre>{itinerary}</pre>
                </motion.div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default AiPlanner;