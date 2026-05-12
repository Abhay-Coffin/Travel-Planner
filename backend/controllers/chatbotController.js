import OpenAI from "openai";

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key missing in backend environment variables",
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

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI travel assistant for a travel planning website. Always answer in clear English.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 900,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Chatbot failed",
      error: error.message,
    });
  }
};