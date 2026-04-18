const { getGenderData } = require('../services/genderizeService');
const { validateName } = require('../utils/validators');

const classifyName = async (req, res) => {
  const validation = validateName(req.query.name);
  if (!validation.valid) {
    return res.status(validation.status).json({
      status: 'error',
      message: validation.message
    });
  }

  const name = validation.name;

  try {
    const apiData = await getGenderData(name);

    if (apiData.gender === null || apiData.count === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No prediction available for the provided name'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        name: apiData.name,
        gender: apiData.gender,
        probability: apiData.probability,
        sample_size: apiData.count,
        is_confident: apiData.probability >= 0.7 && apiData.count >= 100,
        processed_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Genderize upstream error:', error.message);
    return res.status(502).json({
      status: 'error',
      message: 'Failed to fetch data from Genderize API'
    });
  }
};

module.exports = { classifyName };
