import axios from "axios";

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key missing",
      });
    }

    const prompt = `
You are Travel World AI Assistant.

Help users with:
- trip planning
- destination suggestions
- budget travel
- hotel ideas
- food recommendations
- packing tips
- travel safety
- itinerary suggestions

User message:
${message}

Give helpful, practical, friendly travel advice.
Keep answers clear and structured.
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Chatbot failed",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};