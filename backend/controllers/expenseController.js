import OpenAI from "openai";

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const predictExpenses = async (req, res) => {
  try {
    const {
      destination,
      country,
      days,
      travelers,
      budget,
      travelStyle,
    } = req.body;

    if (!destination || !days || !travelers) {
      return res.status(400).json({
        success: false,
        message: "Destination, days and travelers are required",
      });
    }

    const prompt = `
You are an AI travel financial planner.

Predict realistic travel expenses for:

Destination: ${destination}
Country: ${country}
Trip Duration: ${days} days
Travelers: ${travelers}
Current Budget: ${budget || "Not specified"}
Travel Style: ${travelStyle || "moderate"}

Return ONLY valid JSON.

Required JSON format:

{
  "foodCost": number,
  "transportCost": number,
  "hotelCost": number,
  "activityCost": number,
  "hiddenCosts": number,
  "emergencyBuffer": number,
  "recommendedBudget": number,
  "budgetLevel": "budget | moderate | luxury",
  "tips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ]
}
`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.4,
      max_tokens: 700,
    });

    const raw =
      completion.choices?.[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("EXPENSE PREDICTOR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Expense prediction failed",
    });
  }
};