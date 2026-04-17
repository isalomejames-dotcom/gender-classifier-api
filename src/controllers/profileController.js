const { getGenderData } = require('../services/genderizeService');
const { validateName } = require('../utils/validators');

const classifyName = async (req, res) => {
  try {
    const validation = validateName(req.query.name);
    if (!validation.valid) {
      return res.status(validation.status).json({
        status: "error",
        message: validation.message
      });
    }

    const name = validation.name;
    const apiData = await getGenderData(name);

    // Genderize edge case
    if (apiData.gender === null || apiData.count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    // Process exactly as required
    const processedData = {
      name: apiData.name,
      gender: apiData.gender,
      probability: apiData.probability,
      sample_size: apiData.count,
      is_confident: apiData.probability >= 0.7 && apiData.count >= 100,
      processed_at: new Date().toISOString()
    };

    return res.status(200).json({
      status: "success",
      data: processedData
    });

  } catch (error) {
    console.error(error);
    return res.status(502).json({
      status: "error",
      message: "Failed to fetch data from Genderize API"
    });
  }
};

module.exports = { classifyName };