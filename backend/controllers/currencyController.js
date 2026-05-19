import axios from "axios";

export const convertCurrency = async (req, res) => {
  try {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "Amount, from currency and to currency are required",
      });
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (from === to) {
      return res.status(200).json({
        success: true,
        data: {
          amount: numericAmount,
          from,
          to,
          rate: 1,
          converted: true,
        },
      });
    }

    const response = await axios.get("https://api.frankfurter.app/latest", {
      params: {
        amount: numericAmount,
        from,
        to,
      },
    });

    const convertedAmount = response.data?.rates?.[to];

    if (!convertedAmount) {
      return res.status(400).json({
        success: false,
        message: "Currency conversion failed",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        amount: Number(convertedAmount),
        from,
        to,
        rate: Number(convertedAmount) / numericAmount,
        converted: true,
      },
    });
  } catch (error) {
    console.error("CURRENCY CONVERSION ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Currency conversion failed",
      error: error.message,
    });
  }
};