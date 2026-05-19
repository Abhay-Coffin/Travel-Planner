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

export const generateItinerary = async (req, res) => {
  try {
    const destination = sanitizeInput(req.body.destination);
    const days = Number(req.body.days);
    const budget = sanitizeInput(req.body.budget);
    const travelers = Number(req.body.travelers);
    const interests = sanitizeInput(req.body.interests);

    if (!destination || !days || !budget || !travelers || !interests) {
      return res.status(400).json({
        success: false,
        message:
          "Destination, days, budget, travelers and interests are required",
      });
    }

    if (days < 1 || days > 15) {
      return res.status(400).json({
        success: false,
        message: "Trip duration must be between 1 and 15 days",
      });
    }

    if (travelers < 1 || travelers > 20) {
      return res.status(400).json({
        success: false,
        message: "Travelers must be between 1 and 20",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is missing in backend environment variables",
      });
    }

    const prompt = `
Create a premium, practical, day-wise travel itinerary.

User Trip Details:
Destination: ${destination}
Number of days: ${days}
Total budget: ${budget}
Travelers: ${travelers}
Interests: ${interests}

Currency Rules:
- Use the exact same currency written in the budget.
- Never convert the budget to INR unless INR is already provided.
- Do not use ₹ unless the budget is INR.
- Keep all estimated costs in the same budget currency.

Important Quality Rules:
- Make the plan realistic for the given budget.
- Mention budget-saving ideas where useful.
- Avoid vague suggestions.
- Include specific food, places, activities, and timing.
- Keep language simple and readable.
- Do not add markdown tables.
- Do not add fake booking links.

Return the response exactly in this structure:

Trip Summary:
- Destination:
- Duration:
- Budget:
- Travelers:
- Travel Style:
- Best For:

Budget Breakdown:
- Stay:
- Food:
- Local Transport:
- Activities:
- Emergency Buffer:

Trip Intelligence:
- Trip Difficulty:
- Travel Mood:
- Trip Score:
- Best For:
- Daily Average Cost:

Packing Checklist:
- Clothes:
- Documents:
- Gadgets:
- Medicines:
- Weather Gear:

Safety Intelligence:
- Scam Alerts:
- Emergency Tips:
- Safe Transport:
- Local Etiquette:

Smart Recommendations:
- Hidden Gems:
- Best Cafes:
- Best Local Transport:
- Best Time To Visit:

Day-wise Itinerary:
Day 1:
Morning:
Afternoon:
Evening:
Food Suggestions:
Estimated Cost:
Smart Tip:

Continue the same Day format for all ${days} days.

Best Places To Visit:
- 
- 
- 

Local Food To Try:
- 
- 
- 

Packing Suggestions:
- 
- 
- 

Safety Tips:
- 
- 
- 

Budget Saving Tips:
- 
- 
- 

Final Recommendation:
Write a short final recommendation for the traveler.
`;

const groqClient = getGroqClient();


    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a senior travel planner and budget optimization expert. Create practical, safe, engaging, and budget-aware travel itineraries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.65,
      max_tokens: 2200,
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
      error:
        process.env.NODE_ENV === "production"
          ? "AI service error"
          : error.message,
    });
  }
};