import axios from "axios";

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing in backend .env",
      });
    }

    const prompt = `
Create a detailed travel itinerary.

Destination: ${destination}
Number of days: ${days}
Budget: ${budget}
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

Day 2:
Morning:
Afternoon:
Evening:
Food Suggestions:
Estimated Cost:

Continue for all days.

Also include:
- Best places to visit
- Local food to try
- Travel tips
- Budget saving tips
- Packing suggestions

Keep the answer practical, detailed, and easy to read.
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
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

    const itinerary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No itinerary generated.";

    res.status(200).json({
      success: true,
      message: "Itinerary generated successfully",
      data: itinerary,
    });
  } catch (error) {
    console.error("AI itinerary error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate itinerary",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};