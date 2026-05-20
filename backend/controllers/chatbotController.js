import OpenAI from "openai";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in backend .env file");
  }

  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

const sanitizeInput = (value) => {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim();
};

const cleanHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-10)
    .filter(
      (item) =>
        item &&
        ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string"
    )
    .map((item) => ({
      role: item.role,
      content: sanitizeInput(item.content).slice(0, 1200),
    }));
};

export const chatWithAssistant = async (req, res) => {
  try {
    const message = sanitizeInput(req.body.message);
    const history = cleanHistory(req.body.history);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (message.length > 8000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long. Please keep it under 1000 characters.",
      });
    }

    const groqClient = getGroqClient();

    const systemPrompt = `
You are Travel World AI Assistant, a context-aware travel planning assistant.

Your job:
- Help users plan trips.
- Understand follow-up messages using conversation history.
- If user says "make it cheaper", "add nightlife", "make it family friendly", or similar, use previous context.
- Give practical travel advice, not generic paragraphs.
- Answer only in clear English.
- Keep responses structured and easy to read.
- Do not invent booking links.
- Do not ask too many questions unless required.

Response style:
- Use short headings.
- Use bullet points.
- Include budget tips when useful.
- Mention safety and local travel advice when relevant.
`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.65,
      max_tokens: 1000,
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
      message: "Chatbot failed. Please try again.",
      error:
        process.env.NODE_ENV === "production"
          ? "AI service error"
          : error.message,
    });
  }
};