import React, { useEffect, useMemo, useState } from "react";
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
    days: "",
    budget: "",
    currency: "INR",
    travelers: "",
    interests: "",
  });

  const [locationOptions, setLocationOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const [itinerary, setItinerary] = useState("");
  const [convertedBudget, setConvertedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can improve your itinerary, suggest hotels, reduce budget, add activities, and answer travel questions.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // RESTORE STATE ON REFRESH
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("aiPlannerState");

      if (!savedState) return;

      const parsed = JSON.parse(savedState);

      if (parsed.itinerary) setItinerary(parsed.itinerary);
      if (parsed.formData) setFormData(parsed.formData);
      if (parsed.convertedBudget) setConvertedBudget(parsed.convertedBudget);
      if (parsed.weather) setWeather(parsed.weather);
      if (parsed.nearbyPlaces) setNearbyPlaces(parsed.nearbyPlaces);
      if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      if (parsed.conversations) setConversations(parsed.conversations);
      if (parsed.activeConversationId) setActiveConversationId(parsed.activeConversationId);
    } catch (error) {
      console.error("RESTORE STATE ERROR:", error);
    }
  }, []);

  const fullDestination = useMemo(() => {
    return [formData.destination, formData.state, formData.country]
      .filter(Boolean)
      .join(", ");
  }, [formData.destination, formData.state, formData.country]);

  const { days: itineraryDays, extra } = useMemo(
    () => splitItineraryIntoSections(itinerary),
    [itinerary]
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

  const fetchConversations = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setConversations(res.data?.data || []);
    } catch (error) {
      console.error("FETCH CONVERSATIONS ERROR:", error);
    }
  };

  const saveConversation = async (messagesToSave) => {
    try {
      const token = getToken();
      if (!token) return;

      const title = fullDestination || "Travel Planning Chat";

      if (activeConversationId) {
        await axios.put(
          `${BASE_URL}/conversations/${activeConversationId}`,
          {
            title,
            messages: messagesToSave,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        const res = await axios.post(
          `${BASE_URL}/conversations`,
          {
            title,
            messages: messagesToSave,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setActiveConversationId(res.data?.data?._id);
      }

      fetchConversations();
    } catch (error) {
      console.error("SAVE CONVERSATION ERROR:", error);
    }
  };

  const openConversation = (conversation) => {
    setActiveConversationId(conversation._id);
    setChatMessages(conversation.messages || []);
  };

  const deleteConversation = async (id) => {
    try {
      const token = getToken();

      await axios.delete(`${BASE_URL}/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setConversations((prev) => prev.filter((item) => item._id !== id));

      if (activeConversationId === id) {
        setActiveConversationId(null);
        setChatMessages([
          {
            role: "assistant",
            content:
              "Hi! I can improve your itinerary, suggest hotels, reduce budget, add activities, and answer travel questions.",
          },
        ]);
      }

      toast.success("Conversation deleted");
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  const searchDestination = async (value) => {
    setFormData((prev) => ({
      ...prev,
      destination: value,
      country: "",
      state: "",
    }));

    if (value.trim().length < 2) {
      setLocationOptions([]);
      setCountryOptions([]);
      setStateOptions([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/location/search`, {
        params: { query: value },
      });

      const results = res.data?.data || [];
      setLocationOptions(results);

      const countries = [
        ...new Set(results.map((item) => item.country).filter(Boolean)),
      ];

      setCountryOptions(countries);
      setStateOptions([]);
    } catch (error) {
      console.error("Location search error:", error);
    }
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({
      ...prev,
      country,
      state: "",
    }));

    const states = [
      ...new Set(
        locationOptions
          .filter((item) => item.country === country)
          .map((item) => item.state)
          .filter(Boolean)
      ),
    ];

    setStateOptions(states);
  };

  const handleStateSelect = (state) => {
    setFormData((prev) => ({
      ...prev,
      state,
    }));
  };

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
      days: "3",
      budget: "15000",
      currency: "INR",
      travelers: "2",
      interests: "Adventure, nature, cafes, budget travel",
    });

    setCountryOptions(["India"]);
    setStateOptions(["Himachal Pradesh"]);
    setNearbyPlaces([]);

    toast.info("Sample trip filled!");
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      toast.error("Please enter destination.");
      return false;
    }

    if (!formData.country.trim()) {
      toast.error("Please select country.");
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

  const fetchNearbyPlaces = async (destination) => {
    try {
      setNearbyLoading(true);
      setNearbyPlaces([]);

      const response = await axios.get(`${BASE_URL}/location/nearby`, {
        params: { destination },
      });

      setNearbyPlaces(response.data?.data?.places || []);
    } catch (error) {
      console.error("Nearby places error:", error);
      toast.warning("Nearby places could not be loaded.");
    } finally {
      setNearbyLoading(false);
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

  // PLANNER SAVER 
  const savePlannerState = (data = {}) => {
    try {
      localStorage.setItem(
        "aiPlannerState",
        JSON.stringify({
          itinerary,
          formData,
          convertedBudget,
          weather,
          nearbyPlaces,
          chatMessages,
          conversations,
          activeConversationId,
          ...data,
        })
      );
    } catch (error) {
      console.error("SAVE PLANNER STATE ERROR:", error);
    }
  };

  // AUTO SAVE ON CHANGES
  useEffect(() => {
    savePlannerState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    itinerary,
    formData,
    convertedBudget,
    weather,
    nearbyPlaces,
    chatMessages,
    conversations,
    activeConversationId,
  ]);

  const resetPlanner = () => {
    localStorage.removeItem("aiPlannerState");
    setFormData({
      destination: "",
      country: "",
      state: "",
      days: "",
      budget: "",
      currency: "INR",
      travelers: "",
      interests: "",
    });
    setItinerary("");
    setConvertedBudget(null);
    setWeather(null);
    setNearbyPlaces([]);
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hi! I can improve your itinerary, suggest hotels, reduce budget, add activities, and answer travel questions.",
      },
    ]);
    setActiveConversationId(null);
    toast.info("Planner reset to fresh state.");
  };

  const generateItinerary = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setItinerary("");
    setConvertedBudget(null);
    setWeather(null);
    setNearbyPlaces([]);

    try {
      const destinationCurrency = await getDestinationCurrency(formData.country);

      const conversion = await convertCurrency(
        formData.budget,
        formData.currency,
        destinationCurrency
      );

      setConvertedBudget(conversion);

      await fetchWeather(fullDestination);
      await fetchNearbyPlaces(fullDestination);

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
    try {
      if (!itinerary) {
        toast.error("No itinerary to share");
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
        days: Number(formData.days),
        budget: finalBudget,
        travelers: Number(formData.travelers),
        interests: formData.interests,
        itinerary,
        isPublic: true,
      };

      const response = await axios.post(`${BASE_URL}/itineraries`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const shareId = response.data?.data?.shareId;

      if (!shareId) {
        toast.error("Share link could not be created");
        return;
      }

      const shareUrl = `${window.location.origin}/shared/${shareId}`;

      await navigator.clipboard.writeText(shareUrl);

      toast.success("Public share link copied!");
    } catch (error) {
      console.error("SHARE ITINERARY ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to create share link"
      );
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

  const typeAssistantReply = (fullText) => {
    let index = 0;

    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
      },
    ]);

    const interval = setInterval(() => {
      index += 2;

      setChatMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          content: fullText.slice(0, index),
        };

        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 15);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setChatInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      role: "user",
      content: chatInput,
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const currentInput = chatInput;

    setChatInput("");
    setChatLoading(true);

    try {
      const prompt = `
Current trip details:

Destination: ${fullDestination}
Days: ${formData.days}
Budget: ${finalBudget}
Travelers: ${formData.travelers}
Interests: ${formData.interests}

Current itinerary:
${itinerary}

Recent conversation:
${chatMessages
  .slice(-6)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

User request:
${currentInput}

Act as an intelligent travel assistant.
Reply conversationally, clearly, and practically.
If needed, suggest improvements to the itinerary.
`;

      const response = await axios.post(`${BASE_URL}/chatbot`, {
        message: prompt,
      });

      const aiReply =
        response.data?.reply ||
        response.data?.data ||
        "AI assistant could not respond.";

      typeAssistantReply(aiReply);

      const updatedMessages = [
        ...chatMessages,
        userMessage,
        {
          role: "assistant",
          content: aiReply,
        },
      ];

      saveConversation(updatedMessages);

      if (typeof window !== "undefined" && window.speechSynthesis) {
        const speech = new SpeechSynthesisUtterance(aiReply);
        speech.lang = "en-US";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
      }

    } catch (error) {
      console.error("AI CHAT ERROR:", error);
      typeAssistantReply("Something went wrong while contacting AI assistant.");
    } finally {
      setChatLoading(false);
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
                          placeholder="Example: Manali, Paris, New York"
                          value={formData.destination}
                          onChange={(e) => searchDestination(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label>Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={(e) => handleCountrySelect(e.target.value)}
                          required
                        >
                          <option value="">Select Country</option>
                          {countryOptions.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label>State / Region</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={(e) => handleStateSelect(e.target.value)}
                        >
                          <option value="">Select State</option>
                          {stateOptions.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
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
                      type="button"
                      color="danger"
                      className="btn sample__btn"
                      onClick={resetPlanner}
                      disabled={loading}
                      style={{marginLeft: "10px", padding: "10px 20px"}}
                    >
                      Reset Planner
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
                        {convertedBudget.amount.toFixed(2)} {convertedBudget.to}
                      </strong>
                    </div>

                    <div>
                      <span>Exchange Rate</span>
                      <strong>
                        1 {convertedBudget.from} = {convertedBudget.rate.toFixed(4)}{" "}
                        {convertedBudget.to}
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
                            {weather.location?.region}, {weather.location?.country}
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
                    <h4>Live Places Near Your Destination</h4>
                    <p>
                      Real-time attractions, cafes, restaurants, and landmarks
                      fetched from online map data.
                    </p>

                    {nearbyLoading ? (
                      <div className="ai__error">Loading nearby places...</div>
                    ) : nearbyPlaces.length > 0 ? (
                      <div className="landmark__grid">
                        {nearbyPlaces.map((place) => (
                          <motion.div
                            className="landmark__card"
                            key={place.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35 }}
                          >
                            <div className="live__place-card">
                              <span className="ai__badge">{place.type}</span>
                              <h5>{place.name}</h5>
                              <p>{place.description}</p>
                              <small>
                                Lat: {Number(place.lat).toFixed(4)}, Lng:{" "}
                                {Number(place.lng).toFixed(4)}
                              </small>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="ai__error">
                        No live places found. Try adding country/state for better
                        accuracy.
                      </div>
                    )}
                  </div>

                  <div className="ai__chat-section">
                    <div className="ai__chat-header">
                      <span className="ai__badge">AI Travel Assistant</span>
                      <h4>Ask AI To Improve Your Trip</h4>

                      <p>
                        Ask for cheaper plans, luxury upgrades, food
                        recommendations, transport suggestions, couple
                        activities, hidden gems, and more.
                      </p>
                    </div>

                    <div className="ai__conversation-sidebar">
                      <div className="conversation__header">
                        <h5>Saved AI Chats</h5>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveConversationId(null);
                            setChatMessages([
                              {
                                role: "assistant",
                                content:
                                  "Hi! I can improve your itinerary, suggest hotels, reduce budget, add activities, and answer travel questions.",
                              },
                            ]);
                            localStorage.removeItem("aiPlannerState");
                          }}
                        >
                          New Chat
                        </button>
                      </div>

                      {conversations.length === 0 ? (
                        <p className="conversation__empty">No saved chats yet.</p>
                      ) : (
                        conversations.map((conversation) => (
                          <div
                            key={conversation._id}
                            className={`conversation__item ${
                              activeConversationId === conversation._id ? "active" : ""
                            }`}
                          >
                            <div onClick={() => openConversation(conversation)}>
                              <strong>{conversation.title}</strong>
                              <span>{conversation.messages?.length || 0} messages</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteConversation(conversation._id)}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="ai__chat-messages">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`ai__chat-bubble ${
                            msg.role === "user" ? "user" : "assistant"
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="ai__chat-bubble assistant">
                          AI is thinking...
                        </div>
                      )}
                    </div>

                    <div className="ai__chat-input">
                      <input
                        type="text"
                        placeholder="Example: Add adventure activities under budget..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                      />

                      <button
                        type="button"
                        className={`voice__btn ${isListening ? "listening" : ""}`}
                        onClick={startVoiceInput}
                      >
                        <i className="ri-mic-fill"></i>
                      </button>

                      <button onClick={sendChatMessage} disabled={chatLoading}>
                        <i className={chatLoading ? "ri-loader-4-line" : "ri-send-plane-fill"}></i>
                      </button>
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