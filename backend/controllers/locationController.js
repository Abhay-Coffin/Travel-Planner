import axios from "axios";

export const getCountryCurrency = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );

    const countryData = response.data?.[0];
    const currencies = countryData?.currencies;

    const currencyCode = currencies ? Object.keys(currencies)[0] : null;

    if (!currencyCode) {
      return res.status(404).json({
        success: false,
        message: "Currency not found for this country",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        country: countryData.name?.common,
        currency: currencyCode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to detect destination currency",
      error: error.message,
    });
  }
};