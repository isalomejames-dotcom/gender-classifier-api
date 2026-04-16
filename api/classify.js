// api/classify.js

const axios = require('axios');

module.exports = async (req, res) => {
  // CORS header
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name } = req.query;

  // Error Handling & Query Parameter Handling
  // Missing name param
  if (name === undefined || name === null) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required query parameter: name'
    });
  }

  // Name is not a string (e.g. array)
  if (typeof name !== 'string') {
    return res.status(422).json({
      status: 'error',
      message: 'Query parameter "name" must be a string'
    });
  }

  // Empty name
  if (name.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Query parameter "name" must not be empty'
    });
  }

  try {
    // External API Integration
    const genderizeResponse = await axios.get('https://api.genderize.io', {
      params: { name: name.trim() }
    });

    const data = genderizeResponse.data;

    // Data Extraction Accuracy
    const resultName = data.name || name.trim();
    const gender = data.gender || null;
    const probability = typeof data.probability === 'number' ? data.probability : 0;
    const sample_size = typeof data.count === 'number' ? data.count : 0;

    // Handle no prediction available
    if (!gender) {
      return res.status(200).json({
        status: 'error',
        message: 'No prediction available for the provided name'
      });
    }

    // Confidence Logic: probability >= 0.7 AND sample_size >= 100
    const is_confident = probability >= 0.7 && sample_size >= 100;

    // processed_at in valid ISO 8601 UTC format
    const processed_at = new Date().toISOString();

    // Response Format & Structure
    return res.status(200).json({
      status: 'success',
      data: {
        name: resultName,
        gender: gender,
        probability: probability,
        sample_size: sample_size,
        is_confident: is_confident,
        processed_at: processed_at
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch gender data from external API'
    });
  }
};