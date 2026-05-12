import Tour from "../models/Tour.js";

export const getTourBySearch = async (req, res) => {
  const { city, distance, maxGroupSize } = req.query;

  const query = {};

  // Search by city
  if (city) {
    query.city = {
      $regex: new RegExp(city, "i"),
    };
  }

  // Search by minimum distance
  if (distance && !isNaN(distance)) {
    query.distance = {
      $gte: parseInt(distance, 10),
    };
  }

  // Search by minimum group size
  if (maxGroupSize && !isNaN(maxGroupSize)) {
    query.maxGroupSize = {
      $gte: parseInt(maxGroupSize, 10),
    };
  }

  try {
    const tours = await Tour.find(query);

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Search results retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to search for tours",
    });
  }
};