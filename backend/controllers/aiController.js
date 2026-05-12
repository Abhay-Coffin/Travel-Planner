import OpenAI from "openai";

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateItinerary = async (req, res) => {
  const { destination, days, budget, travelers, interests } = req.body;

  try {
    if (!destination || !days || !budget || !travelers || !interests) {
      return res.status(400).json({
        success: false,
        message:
          "Destination, days, budget, travelers and interests are required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is missing in backend environment variables",
      });
    }

    const prompt = `
Create a detailed travel itinerary.

Destination: ${destination}
Number of days: ${days}
Budget: ₹${budget}
Travelers: ${travelers}
Interests: ${interests}

Return the response in this format:

Trip Summary:
- Destination:
- Duration:
- Budget:
- Travelers:
- Travel Style:

Day-wise Itinerary:
Day 1:
Morning:
Afternoon:
Evening:
Food Suggestions:
Estimated Cost:

Continue for all ${days} days.

Also include:
- Best places to visit
- Local food to try
- Travel tips
- Budget saving tips
- Packing suggestions

Keep the answer practical, detailed, and easy to read.
`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional travel planner. Create practical, budget-friendly, day-wise itineraries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1800,
    });

    const itinerary =
      completion.choices?.[0]?.message?.content || "No itinerary generated.";

    res.status(200).json({
      success: true,
      message: "Itinerary generated successfully",
      data: itinerary,
    });
  } catch (error) {
    console.error("AI itinerary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate itinerary",
      error: error.message,
    });
  }
};