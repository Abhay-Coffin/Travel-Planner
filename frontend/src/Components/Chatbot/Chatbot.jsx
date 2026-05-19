import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../utils/config";
import "./Chatbot.css";

const defaultMessages = [
  {
    sender: "bot",
    text: "Hi! I’m your AI Travel Assistant. Ask me about trips, budgets, hotels, food, packing, safety, or itineraries.",
  },
];

const quickQuestions = [
  "Plan a 3-day Manali trip under ₹15000",
  "Make my last trip cheaper",
  "Suggest a family-friendly Goa trip",
  "Create a packing list for hill station",
];

const MAX_HISTORY_FOR_AI = 10;

const Chatbot = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("travelChatMessages");
      return saved ? JSON.parse(saved) : defaultMessages;
    } catch {
      return defaultMessages;
    }
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("travelChatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async (e, quickText = null) => {
    if (e) e.preventDefault();

    const finalMessage = quickText || message;

    if (!finalMessage.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: finalMessage.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(-MAX_HISTORY_FOR_AI)
        .map((item) => ({
          role: item.sender === "user" ? "user" : "assistant",
          content: item.text,
        }));

      const res = await axios.post(`${BASE_URL}/chatbot`, {
        message: finalMessage.trim(),
        history,
      });

      const botReply =
        res.data?.reply ||
        res.data?.data ||
        "Sorry, I could not generate a reply.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
        },
      ]);
    } catch (error) {
      console.error("CHATBOT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            error.response?.data?.message ||
            "Sorry, the chatbot is not responding right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(defaultMessages);
    localStorage.removeItem("travelChatMessages");
  };

  const openAiPlanner = () => {
    setOpen(false);
    navigate("/ai-planner");
  };

  return (
    <>
      <motion.button
        className="chatbot__toggle"
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open chatbot"
      >
        {open ? (
          <i className="ri-close-line"></i>
        ) : (
          <i className="ri-robot-2-line"></i>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot__box"
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.92 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chatbot__header">
              <div>
                <h5>AI Travel Assistant</h5>
                <p>
                  <span className="online__dot"></span>
                  Context-aware
                </p>
              </div>

              <div className="chatbot__header-actions">
                <button
                  type="button"
                  onClick={openAiPlanner}
                  title="Open AI Planner"
                >
                  <i className="ri-map-2-line"></i>
                </button>

                <button type="button" onClick={clearChat} title="Clear chat">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>

            <div className="chatbot__quick">
              {quickQuestions.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => sendMessage(null, item)}
                  disabled={loading}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="chatbot__messages">
              {messages.map((item, index) => (
                <div
                  className={`chatbot__message ${
                    item.sender === "user" ? "user" : "bot"
                  }`}
                  key={`${item.sender}-${index}`}
                >
                  <p>{item.text}</p>
                </div>
              ))}

              {loading && (
                <div className="chatbot__message bot">
                  <div className="typing__bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            <form className="chatbot__form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Ask about your trip..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />

              <button type="submit" disabled={loading || !message.trim()}>
                <i className="ri-send-plane-fill"></i>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;