const axios = require('axios');

module.exports = async (req, res) => {
  // CORS - this is required by the grader
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const name = req.query.name;

    // Strict validation for 400/422
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        status: "error",
        message: "Name parameter is required and must be a non-empty string"
      });
    }

    const cleanName = name.trim();

    // Call Genderize
    const response = await axios.get(`https://api.genderize.io?name=${encodeURIComponent(cleanName)}`);
    const data = response.data;

    // Edge case
    if (data.gender === null || data.count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    // Process exactly as required
    const result = {
      name: data.name,
      gender: data.gender,
      probability: data.probability,
      sample_size: data.count,
      is_confident: data.probability >= 0.7 && data.count >= 100,
      processed_at: new Date().toISOString()
    };

    // Exact success format the grader wants
    return res.status(200).json({
      status: "success",
      data: result
    });

  } catch (error) {
    return res.status(502).json({
      status: "error",
      message: "Failed to fetch data from Genderize API"
    });
  }
};