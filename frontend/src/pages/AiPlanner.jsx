import React, { useMemo, useState } from "react";
import { Container, Row, Col, Button, Form, FormGroup } from "reactstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CommonSection from "../Shared/CommonSection";
import Newsletter from "../Shared/Newsletter";
import Loader from "../Components/Loader/Loader";
import BackButton from "../Components/common/BackButton";
import AIMap from "../Components/AIMap/AIMap";

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

const interestSuggestions = [
  "Adventure",
  "Food",
  "Nightlife",
  "Museums",
  "Shopping",
  "Nature",
  "Budget travel",
  "Luxury",
  "Family friendly",
];

const destinationImageMap = {
  manali: [
    {
      title: "Solang Valley",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
      description: "Adventure activities, mountain views, and snow experiences.",
    },
    {
      title: "Hadimba Devi Temple",
      image:
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80",
      description: "A peaceful temple surrounded by cedar forest.",
    },
    {
      title: "Old Manali",
      image:
        "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=900&q=80",
      description: "Cafes, local markets, backpacker vibe, and riverside walks.",
    },
  ],
  goa: [
    {
      title: "Baga Beach",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
      description: "Popular beach for nightlife, water sports, and cafes.",
    },
    {
      title: "Fort Aguada",
      image:
        "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?auto=format&fit=crop&w=900&q=80",
      description: "Historic sea-facing fort with scenic views.",
    },
    {
      title: "Palolem Beach",
      image:
        "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=900&q=80",
      description: "Calm beach ideal for relaxing and kayaking.",
    },
  ],
  paris: [
    {
      title: "Eiffel Tower",
      image:
        "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=900&q=80",
      description: "Iconic landmark and must-visit viewpoint.",
    },
    {
      title: "Louvre Museum",
      image:
        "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=900&q=80",
      description: "World-famous museum with art, history, and architecture.",
    },
    {
      title: "Montmartre",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
      description: "Charming streets, cafes, artists, and city views.",
    },
  ],
};

const fallbackImages = [
  {
    title: "Popular Landmark",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    description: "Explore famous tourist attractions and scenic locations.",
  },
  {
    title: "Local Experience",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    description: "Enjoy food, culture, markets, and local experiences.",
  },
  {
    title: "Travel Inspiration",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    description: "Discover memorable places during your trip.",
  },
];

const getDestinationImages = (destination) => {
  const value = destination.toLowerCase();
  const matchedKey = Object.keys(destinationImageMap).find((key) =>
    value.includes(key)
  );

  return matchedKey ? destinationImageMap[matchedKey] : fallbackImages;
};

const splitItineraryIntoSections = (text) => {
  if (!text) return { days: [], extra: "" };

  const normalized = text.replace(/\r/g, "");

  const firstExtraIndex = normalized.search(
    /(Best Places To Visit:|Best places to visit:|Local Food To Try:|Local food to try:|Packing Suggestions:|Safety Tips:|Budget Saving Tips:|Final Recommendation:)/i
  );

  const dayText =
    firstExtraIndex !== -1 ? normalized.slice(0, firstExtraIndex) : normalized;

  const extraText =
    firstExtraIndex !== -1 ? normalized.slice(firstExtraIndex).trim() : "";

  const dayBlocks = dayText.split(/(?=Day\s+\d+\s*:)/gi);

  const days = dayBlocks
    .filter((block) => /^Day\s+\d+\s*:/i.test(block.trim()))
    .map((block, index) => {
      const title = block.match(/^Day\s+\d+\s*:/i)?.[0] || `Day ${index + 1}`;

      return {
        id: index + 1,
        title: title.replace(":", ""),
        content: block.replace(/^Day\s+\d+\s*:/i, "").trim(),
      };
    });

  return { days, extra: extraText };
};

const BUDGET_COLORS = [
  "#ff8c00",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
];

const getCurrencySymbol = (currencyText = "") => {
  if (currencyText.includes("INR")) return "₹";
  if (currencyText.includes("USD")) return "$";
  if (currencyText.includes("EUR")) return "€";
  if (currencyText.includes("GBP")) return "£";
  if (currencyText.includes("JPY")) return "¥";
  if (currencyText.includes("AUD")) return "A$";
  if (currencyText.includes("CAD")) return "C$";
  if (currencyText.includes("CHF")) return "CHF ";
  return "";
};

const extractBudgetNumber = (budgetText = "") => {
  const match = String(budgetText).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const extractBudgetBreakdown = (finalBudget = "") => {
  const total = extractBudgetNumber(finalBudget);
  const symbol = getCurrencySymbol(finalBudget);

  const distribution = [
    { name: "Stay", percent: 35 },
    { name: "Food", percent: 25 },
    { name: "Local Transport", percent: 15 },
    { name: "Activities", percent: 20 },
    { name: "Emergency Buffer", percent: 5 },
  ];

  return distribution.map((item) => {
    const amount = Math.round((total * item.percent) / 100);

    return {
      name: item.name,
      value: amount,
      percent: item.percent,
      detail: `${symbol}${amount.toLocaleString()} (${item.percent}%)`,
    };
  });
};

const extractTripIntelligence = (text = "") => {
  const getValue = (label, fallback) => {
    const regex = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
    return text.match(regex)?.[1]?.trim() || fallback;
  };

  return {
    difficulty: getValue("Trip Difficulty", "Moderate"),
    mood: getValue("Travel Mood", "Adventure"),
    score: getValue("Trip Score", "85/100"),
    bestFor: getValue("Best For", "Travelers"),
    dailyAverageCost: getValue("Daily Average Cost", "Estimated"),
  };
};

const extractPackingChecklist = (text = "") => {
  const labels = [
    "Clothes",
    "Documents",
    "Gadgets",
    "Medicines",
    "Weather Gear",
  ];

  return labels.map((label) => {
    const regex = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
    const value = text.match(regex)?.[1]?.trim() || "Recommended essentials";

    return {
      category: label,
      items: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  });
};

const extractSafetyIntelligence = (text = "") => {
  const labels = [
    "Scam Alerts",
    "Emergency Tips",
    "Safe Transport",
    "Local Etiquette",
  ];

  return labels.map((label) => {
    const regex = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
    const value =
      text.match(regex)?.[1]?.trim() ||
      "Stay alert, keep essentials safe, and follow local guidance.";

    return {
      title: label,
      value,
    };
  });
};

const extractSmartRecommendations = (text = "") => {
  const labels = [
    "Hidden Gems",
    "Best Cafes",
    "Best Local Transport",
    "Best Time To Visit",
  ];

  return labels.map((label) => {
    const regex = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
    const value =
      text.match(regex)?.[1]?.trim() ||
      "AI will suggest better options after itinerary generation.";

    return {
      title: label,
      value,
    };
  });
};

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      user?.token ||
      user?.data?.token ||
      user?.accessToken ||
      user?.data?.accessToken ||
      user?.jwt ||
      user?.data?.jwt ||
      localStorage.getItem("token")
    );
  } catch {
    return localStorage.getItem("token");
  }
};

const AiPlanner = () => {
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    state: "",
    city: "",
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

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fullDestination = useMemo(() => {
    return [
      formData.destination,
      formData.city,
      formData.state,
      formData.country,
    ]
      .filter(Boolean)
      .join(", ");
  }, [formData.destination, formData.city, formData.state, formData.country]);

  const { days: itineraryDays, extra } = useMemo(
    () => splitItineraryIntoSections(itinerary),
    [itinerary]
  );

  const destinationImages = useMemo(
    () => getDestinationImages(fullDestination || formData.destination),
    [fullDestination, formData.destination]
  );

  const finalBudget = convertedBudget
    ? `${convertedBudget.amount.toFixed(2)} ${convertedBudget.to}`
    : `${formData.budget} ${formData.currency}`;

  const budgetBreakdown = useMemo(
    () => extractBudgetBreakdown(finalBudget),
    [finalBudget]
  );

  const totalEstimatedBudget = budgetBreakdown.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const tripIntelligence = useMemo(
    () => extractTripIntelligence(itinerary),
    [itinerary]
  );

  const packingChecklist = useMemo(
    () => extractPackingChecklist(itinerary),
    [itinerary]
  );

  const safetyIntelligence = useMemo(
    () => extractSafetyIntelligence(itinerary),
    [itinerary]
  );

  const smartRecommendations = useMemo(
    () => extractSmartRecommendations(itinerary),
    [itinerary]
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getDestinationCurrency = async (country) => {
    try {
      const response = await axios.get(`${BASE_URL}/location/currency`, {
        params: { country },
      });

      return response.data?.data?.currency || formData.currency;
    } catch (error) {
      console.error("Destination currency error:", error);
      toast.warning(
        "Could not detect destination currency. Using selected currency."
      );
      return formData.currency;
    }
  };

  const addInterest = (interest) => {
    setFormData((prev) => {
      const current = prev.interests.trim();

      if (current.toLowerCase().includes(interest.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        interests: current ? `${current}, ${interest}` : interest,
      };
    });
  };

  const fillSampleTrip = () => {
    setFormData({
      destination: "Mall Road",
      country: "India",
      state: "Himachal Pradesh",
      city: "Manali",
      days: "3",
      budget: "15000",
      currency: "INR",
      travelers: "2",
      interests: "Adventure, nature, cafes, budget travel",
    });

    toast.info("Sample trip filled!");
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      toast.error("Please enter destination.");
      return false;
    }

    if (!formData.country.trim()) {
      toast.error("Please enter country.");
      return false;
    }

    if (Number(formData.days) < 1 || Number(formData.days) > 15) {
      toast.error("Please enter trip duration between 1 and 15 days.");
      return false;
    }

    if (Number(formData.travelers) < 1 || Number(formData.travelers) > 20) {
      toast.error("Travelers must be between 1 and 20.");
      return false;
    }

    if (Number(formData.budget) <= 0) {
      toast.error("Budget must be greater than 0.");
      return false;
    }

    return true;
  };

  const fetchWeather = async (destination) => {
    try {
      setWeatherLoading(true);
      setWeather(null);

      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          city: destination,
        },
      });

      setWeather(response.data?.data || null);
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast.warning("Weather data not available for this destination.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const numericAmount = Number(amount);

      if (!numericAmount || numericAmount <= 0) {
        throw new Error("Invalid budget amount.");
      }

      if (fromCurrency === toCurrency) {
        return {
          amount: numericAmount,
          from: fromCurrency,
          to: toCurrency,
          rate: 1,
          converted: false,
        };
      }

      const response = await axios.get(`${BASE_URL}/currency/convert`, {
        params: {
          amount: numericAmount,
          from: fromCurrency,
          to: toCurrency,
        },
      });

      return response.data?.data;
    } catch (error) {
      console.error("Currency conversion error:", error);

      toast.warning("Currency conversion failed. Using original budget.");

      return {
        amount: Number(amount),
        from: fromCurrency,
        to: fromCurrency,
        rate: 1,
        converted: false,
      };
    }
  };

  const generateItinerary = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setItinerary("");
    setConvertedBudget(null);
    setWeather(null);

    try {
      const destinationCurrency = await getDestinationCurrency(
        formData.country
      );

      const conversion = await convertCurrency(
        formData.budget,
        formData.currency,
        destinationCurrency
      );

      setConvertedBudget(conversion);

      await fetchWeather(fullDestination);

      const payload = {
        ...formData,
        destination: fullDestination,
        destinationCurrency,
        originalBudget: `${formData.budget} ${formData.currency}`,
        convertedBudget: `${conversion.amount.toFixed(2)} ${conversion.to}`,
        budget: `${conversion.amount.toFixed(2)} ${conversion.to}`,
      };

      const response = await axios.post(`${BASE_URL}/ai/itinerary`, payload);

      setItinerary(response.data?.data || "No itinerary generated.");
      toast.success("AI itinerary generated!");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate itinerary.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTripPayload = (id = null) => ({
    id,
    destination: fullDestination,
    country: formData.country,
    state: formData.state,
    city: formData.city,
    days: formData.days,
    budget: finalBudget,
    travelers: formData.travelers,
    interests: formData.interests,
    itinerary,
    createdAt: new Date().toISOString(),
  });

  const saveItinerary = async () => {
    try {
      if (!itinerary) {
        toast.error("No itinerary to save");
        return;
      }

      const token = getToken();

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const payload = {
        destination: fullDestination,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        days: Number(formData.days),
        budget: finalBudget,
        travelers: Number(formData.travelers),
        interests: formData.interests,
        itinerary,
        isPublic: false,
      };

      const response = await axios.post(`${BASE_URL}/itineraries`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("SAVE RESPONSE:", response.data);

      toast.success("Itinerary Saved!");
    } catch (error) {
      console.error("SAVE ITINERARY ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to save itinerary");
    }
  };

  const shareItinerary = async () => {
    if (!itinerary) return;

    const id = `trip-${Date.now()}`;
    const sharedTrip = createTripPayload(id);

    const existingTrips =
      JSON.parse(localStorage.getItem("sharedItineraries")) || [];

    localStorage.setItem(
      "sharedItineraries",
      JSON.stringify([sharedTrip, ...existingTrips])
    );

    const shareUrl = `${window.location.origin}/shared/${shareId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    } catch {
      toast.info("Share link created!");
    }
  };

  const copyItinerary = async () => {
    if (!itinerary) return;

    try {
      await navigator.clipboard.writeText(itinerary);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed. Please try again.");
    }
  };

  const downloadItinerary = () => {
    if (!itinerary) return;

    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pageWidth - margin * 2;

    let y = 18;

    const addText = (text, size = 11, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(size);

      const lines = doc.splitTextToSize(String(text), usableWidth);

      lines.forEach((line) => {
        if (y > pageHeight - 15) {
          doc.addPage();
          y = 18;
        }

        doc.text(line, margin, y);
        y += size * 0.45;
      });

      y += 3;
    };

    doc.setFillColor(255, 247, 232);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("AI Travel Itinerary", margin, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Generated by Travel Planner", margin, 27);

    y = 45;

    addText(`Destination: ${fullDestination}`, 12, true);
    addText(`Days: ${formData.days}`, 11);
    addText(`Travelers: ${formData.travelers}`, 11);
    addText(`Budget: ${finalBudget}`, 11);
    addText(`Interests: ${formData.interests}`, 11);

    y += 5;

    addText("Generated Itinerary", 15, true);
    addText(itinerary, 10);

    doc.save(`${formData.destination || "travel"}-itinerary.pdf`);

    toast.success("PDF itinerary downloaded!");
  };

  return (
    <>
      <CommonSection title="AI Itinerary Generator" />

      <section className="ai__planner">
        <Container>
          <BackButton />

          <Row className="justify-content-center">
            <Col lg="10">
              <motion.div
                className="ai__planner-card"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="ai__planner-header">
                  <span className="ai__badge">AI Powered Trip Builder</span>
                  <h2>Build a personalized travel plan in seconds</h2>
                  <p>
                    Enter your destination, country, budget, travelers, and
                    interests. Our AI will create a practical day-wise travel
                    plan with food, activities, tips, weather, maps, and cost
                    estimates.
                  </p>
                </div>

                <Form onSubmit={generateItinerary}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Destination</label>
                        <input
                          type="text"
                          name="destination"
                          placeholder="Example: Mall Road, Eiffel Tower, Local Market"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          placeholder="Example: India"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <label>State / Region</label>
                        <input
                          type="text"
                          name="state"
                          placeholder="Example: Himachal Pradesh"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Example: Shimla"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label>Days</label>
                        <input
                          type="number"
                          name="days"
                          min="1"
                          max="15"
                          placeholder="3"
                          value={formData.days}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label>Travelers</label>
                        <input
                          type="number"
                          name="travelers"
                          min="1"
                          max="20"
                          placeholder="2"
                          value={formData.travelers}
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
                            min="1"
                            placeholder="Enter total budget"
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
                        <label>Quick Interest Tags</label>
                        <div className="interest__chips">
                          {interestSuggestions.map((interest) => (
                            <button
                              type="button"
                              key={interest}
                              onClick={() => addInterest(interest)}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
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

                  <div className="ai__form-actions">
                    <Button
                      type="button"
                      className="btn secondary__btn sample__btn"
                      onClick={fillSampleTrip}
                      disabled={loading}
                    >
                      Fill Sample
                    </Button>

                    <Button
                      type="submit"
                      className="btn primary__btn ai__btn"
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate AI Itinerary"}
                    </Button>
                  </div>
                </Form>
              </motion.div>
            </Col>
          </Row>

          {loading && (
            <div className="ai__loading">
              <Loader />
              <p>Creating your smart itinerary...</p>
            </div>
          )}

          {error && (
            <Row className="justify-content-center mt-4">
              <Col lg="10">
                <div className="ai__error">{error}</div>
              </Col>
            </Row>
          )}

          {convertedBudget && (
            <Row className="justify-content-center mt-4">
              <Col lg="10">
                <div className="currency__summary">
                  <h5>Currency & Budget Summary</h5>

                  <div className="summary__grid">
                    <div>
                      <span>Original Budget</span>
                      <strong>
                        {formData.budget} {formData.currency}
                      </strong>
                    </div>

                    <div>
                      <span>Planning Budget</span>
                      <strong>
                        {convertedBudget.amount.toFixed(2)}{" "}
                        {convertedBudget.to}
                      </strong>
                    </div>

                    <div>
                      <span>Exchange Rate</span>
                      <strong>
                        1 {convertedBudget.from} ={" "}
                        {convertedBudget.rate.toFixed(4)} {convertedBudget.to}
                      </strong>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {itinerary && (
            <Row className="justify-content-center mt-5">
              <Col lg="10">
                <motion.div
                  className="ai__result"
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="ai__result-header">
                    <div>
                      <span className="ai__badge">Generated Plan</span>
                      <h3>{fullDestination} Travel Itinerary</h3>
                      <p>
                        {formData.days} days • {formData.travelers} travelers •{" "}
                        {finalBudget}
                      </p>
                    </div>

                    <div className="ai__actions">
                      <Button color="success" onClick={saveItinerary}>
                        Save
                      </Button>

                      <Button color="info" onClick={copyItinerary}>
                        Copy
                      </Button>

                      <Button color="warning" onClick={shareItinerary}>
                        Share
                      </Button>

                      <Button color="dark" onClick={downloadItinerary}>
                        PDF
                      </Button>
                    </div>
                  </div>

                  {weatherLoading && (
                    <div className="weather__card">
                      <h4>Fetching Weather...</h4>
                      <p>
                        Please wait while we load current weather for your
                        destination.
                      </p>
                    </div>
                  )}

                  {weather && (
                    <div className="weather__card">
                      <div className="weather__main">
                        <div>
                          <span className="ai__badge">Live Weather</span>
                          <h4>{weather.location?.name}</h4>
                          <p>
                            {weather.location?.region},{" "}
                            {weather.location?.country}
                          </p>
                        </div>

                        <div className="weather__temp">
                          <img
                            src={weather.current?.condition?.icon}
                            alt="weather"
                          />
                          <strong>{weather.current?.temp_c}°C</strong>
                          <span>{weather.current?.condition?.text}</span>
                        </div>
                      </div>

                      <div className="weather__grid">
                        <div>
                          <span>Feels Like</span>
                          <strong>{weather.current?.feelslike_c}°C</strong>
                        </div>

                        <div>
                          <span>Humidity</span>
                          <strong>{weather.current?.humidity}%</strong>
                        </div>

                        <div>
                          <span>Wind</span>
                          <strong>{weather.current?.wind_kph} km/h</strong>
                        </div>

                        <div>
                          <span>UV Index</span>
                          <strong>{weather.current?.uv}</strong>
                        </div>
                      </div>

                      <div className="forecast__grid">
                        {weather.forecast?.forecastday?.map((day) => (
                          <div className="forecast__card" key={day.date}>
                            <span>{day.date}</span>
                            <img
                              src={day.day?.condition?.icon}
                              alt="forecast"
                            />
                            <strong>
                              {day.day?.mintemp_c}°C / {day.day?.maxtemp_c}°C
                            </strong>
                            <p>{day.day?.condition?.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <AIMap destination={fullDestination} />

                  <div className="landmark__section">
                    <h4>Visual Trip Inspiration</h4>
                    <p>
                      Famous attractions and travel highlights related to your
                      destination.
                    </p>

                    <div className="landmark__grid">
                      {destinationImages.map((item, index) => (
                        <motion.div
                          className="landmark__card"
                          key={`${item.title}-${index}`}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35 }}
                        >
                          <img src={item.image} alt={item.title} />

                          <div>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="trip__intelligence">
                    <div className="trip__intel-card">
                      <span>Trip Difficulty</span>
                      <strong>{tripIntelligence.difficulty}</strong>
                    </div>

                    <div className="trip__intel-card">
                      <span>Travel Mood</span>
                      <strong>{tripIntelligence.mood}</strong>
                    </div>

                    <div className="trip__intel-card score">
                      <span>Trip Score</span>
                      <strong>{tripIntelligence.score}</strong>
                    </div>

                    <div className="trip__intel-card">
                      <span>Best For</span>
                      <strong>{tripIntelligence.bestFor}</strong>
                    </div>

                    <div className="trip__intel-card">
                      <span>Daily Avg Cost</span>
                      <strong>{tripIntelligence.dailyAverageCost}</strong>
                    </div>
                  </div>

                  <div className="budget__intelligence">
                    <div className="budget__header">
                      <span className="ai__badge">
                        Smart Budget Intelligence
                      </span>
                      <h4>Estimated Trip Cost Breakdown</h4>
                      <p>
                        Budget is automatically distributed based on your total
                        trip budget.
                      </p>
                    </div>

                    <div className="budget__analytics">
                      <div className="budget__chart">
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie
                              data={budgetBreakdown}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={85}
                              label={({ name, percent }) =>
                                `${name} ${percent}%`
                              }
                            >
                              {budgetBreakdown.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={BUDGET_COLORS[index]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="budget__total">
                          <span>Total Estimated Budget</span>
                          <strong>
                            {getCurrencySymbol(finalBudget)}
                            {totalEstimatedBudget.toLocaleString()}
                          </strong>
                        </div>
                      </div>

                      <div className="budget__cards">
                        {budgetBreakdown.map((item, index) => (
                          <div className="budget__mini-card" key={item.name}>
                            <div
                              className="budget__color-dot"
                              style={{
                                backgroundColor: BUDGET_COLORS[index],
                              }}
                            ></div>

                            <div>
                              <span>{item.name}</span>
                              <strong>{item.detail}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="packing__section">
                    <div className="packing__header">
                      <span className="ai__badge">Smart Packing Checklist</span>
                      <h4>Things to Pack</h4>
                      <p>
                        AI-generated checklist based on your destination,
                        weather, and trip mood.
                      </p>
                    </div>

                    <div className="packing__grid">
                      {packingChecklist.map((group) => (
                        <div className="packing__card" key={group.category}>
                          <h5>{group.category}</h5>

                          {group.items.map((item, index) => (
                            <label
                              key={`${item}-${index}`}
                              className="packing__item"
                            >
                              <input type="checkbox" />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="safety__section">
                    <div className="safety__header">
                      <span className="ai__badge">Safety Intelligence</span>
                      <h4>Travel Safety & Local Awareness</h4>
                      <p>
                        AI-generated safety guidance to help users travel more
                        confidently.
                      </p>
                    </div>

                    <div className="safety__grid">
                      {safetyIntelligence.map((item) => (
                        <div className="safety__card" key={item.title}>
                          <h5>{item.title}</h5>
                          <p>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="smart__recommendations">
                    <div className="smart__header">
                      <span className="ai__badge">Smart Recommendations</span>
                      <h4>Local Gems & Travel Suggestions</h4>
                      <p>
                        Extra AI suggestions for food, transport, timing, and
                        unique experiences.
                      </p>
                    </div>

                    <div className="smart__grid">
                      {smartRecommendations.map((item) => (
                        <div className="smart__card" key={item.title}>
                          <h5>{item.title}</h5>
                          <p>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {itineraryDays.length > 0 ? (
                    <div className="day__cards">
                      {itineraryDays.map((day) => (
                        <motion.div
                          className="day__card"
                          key={day.id}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35 }}
                        >
                          <div className="day__number">{day.id}</div>

                          <div>
                            <h4>{day.title}</h4>
                            <p>{day.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <pre>{itinerary}</pre>
                  )}

                  {extra && (
                    <div className="extra__trip-guide">
                      <div className="extra__trip-header">
                        <span className="ai__badge">Beyond Daily Plan</span>
                        <h4>Extra Activities & Travel Guide</h4>
                        <p>
                          Optional attractions, food, safety, packing, and
                          budget tips for your complete trip.
                        </p>
                      </div>

                      <pre>{extra}</pre>
                    </div>
                  )}

                  <details className="raw__itinerary">
                    <summary>View full raw itinerary</summary>
                    <pre>{itinerary}</pre>
                  </details>
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