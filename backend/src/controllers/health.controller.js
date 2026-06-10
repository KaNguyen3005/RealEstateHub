function getHealthCheck(req, res) {
  res.status(200).json({
    success: true,
    message: "RealEstateHub API is running",
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  getHealthCheck
};
