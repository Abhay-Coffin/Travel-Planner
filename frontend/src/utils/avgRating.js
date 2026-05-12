const calculateAvgRating = (reviews = []) => {
  if (!reviews.length) {
    return {
      totalRating: 0,
      avgRating: 0,
    };
  }

  const totalRating = reviews.reduce(
    (acc, item) => acc + Number(item.rating || 0),
    0
  );

  const avgRating = (
    totalRating / reviews.length
  ).toFixed(1);

  return {
    totalRating,
    avgRating,
  };
};

export default calculateAvgRating;